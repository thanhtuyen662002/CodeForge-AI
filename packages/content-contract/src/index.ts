export type SkillStatus = "draft" | "published" | "retired";
export type DependencyKind = "hard" | "soft";

export interface SkillNode { id: string; slug: string; domain: string; name: { vi: string; en: string }; description: string; version: number; status: SkillStatus }
export interface SkillDependency { prerequisiteId: string; skillId: string; kind: DependencyKind; reason: string }
export interface ContentItemReference { id: string; version: number; difficulty: number; primarySkillId: string; secondarySkillIds?: string[] }
export interface ContentGraph { schemaVersion: 1; version: string; skills: SkillNode[]; dependencies: SkillDependency[]; contentItems: ContentItemReference[] }
export interface ValidationIssue { code: string; path: string; message: string }

const statuses = new Set<SkillStatus>(["draft", "published", "retired"]);
const kinds = new Set<DependencyKind>(["hard", "soft"]);
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const nonBlank = (value: unknown): value is string => typeof value === "string" && value.length > 0 && value.trim() === value;
const positiveInt = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value > 0;
const add = (out: ValidationIssue[], code: string, path: string, message: string) => out.push({ code, path, message });

function requiredString(value: unknown, out: ValidationIssue[], code: string, path: string): string | undefined {
  if (!nonBlank(value)) { add(out, code, path, "A non-empty string is required."); return undefined; }
  return value;
}

/** Structural validation only; it does not certify quality, provenance, licensing, human review, or learning efficacy. */
export function validateContentGraph(input: unknown): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  if (!isObject(input)) return [{ code: "GRAPH_OBJECT_REQUIRED", path: "$", message: "Content graph must be an object." }];
  if (input.schemaVersion !== 1) add(out, "GRAPH_SCHEMA_VERSION_INVALID", "schemaVersion", "schemaVersion must be 1.");
  requiredString(input.version, out, "GRAPH_VERSION_REQUIRED", "version");

  const skills = Array.isArray(input.skills) ? input.skills : null;
  const dependencies = Array.isArray(input.dependencies) ? input.dependencies : null;
  const items = Array.isArray(input.contentItems) ? input.contentItems : null;
  if (!skills) add(out, "SKILLS_REQUIRED", "skills", "skills must be an array.");
  else if (!skills.length) add(out, "SKILLS_EMPTY", "skills", "At least one skill is required.");
  if (!dependencies) add(out, "DEPENDENCIES_REQUIRED", "dependencies", "dependencies must be an array.");
  if (!items) add(out, "CONTENT_ITEMS_REQUIRED", "contentItems", "contentItems must be an array.");

  const skillIds = new Set<string>();
  for (const [i, raw] of (skills ?? []).entries()) {
    const path = `skills[${i}]`;
    if (!isObject(raw)) { add(out, "SKILL_OBJECT_REQUIRED", path, "Skill must be an object."); continue; }
    const id = requiredString(raw.id, out, "SKILL_ID_REQUIRED", `${path}.id`);
    if (id && skillIds.has(id)) add(out, "DUPLICATE_SKILL_ID", `${path}.id`, `Duplicate skill id: ${id}.`);
    else if (id) skillIds.add(id);
    requiredString(raw.slug, out, "SKILL_SLUG_REQUIRED", `${path}.slug`);
    requiredString(raw.domain, out, "SKILL_DOMAIN_REQUIRED", `${path}.domain`);
    const name = raw.name;
    if (!isObject(name) || !nonBlank(name.vi) || !nonBlank(name.en)) add(out, "SKILL_NAME_INVALID", `${path}.name`, "Both vi and en names are required.");
    requiredString(raw.description, out, "SKILL_DESCRIPTION_REQUIRED", `${path}.description`);
    if (!positiveInt(raw.version)) add(out, "SKILL_VERSION_INVALID", `${path}.version`, "Skill version must be a positive integer.");
    if (typeof raw.status !== "string" || !statuses.has(raw.status as SkillStatus)) add(out, "SKILL_STATUS_INVALID", `${path}.status`, "Status must be draft, published, or retired.");
  }

  const edges = new Map([...skillIds].map((id) => [id, new Set<string>()]));
  const pairs = new Set<string>();
  for (const [i, raw] of (dependencies ?? []).entries()) {
    const path = `dependencies[${i}]`;
    if (!isObject(raw)) { add(out, "DEPENDENCY_OBJECT_REQUIRED", path, "Dependency must be an object."); continue; }
    const from = requiredString(raw.prerequisiteId, out, "PREREQUISITE_ID_REQUIRED", `${path}.prerequisiteId`);
    const to = requiredString(raw.skillId, out, "DEPENDENT_SKILL_ID_REQUIRED", `${path}.skillId`);
    if (typeof raw.kind !== "string" || !kinds.has(raw.kind as DependencyKind)) add(out, "DEPENDENCY_KIND_INVALID", `${path}.kind`, "Kind must be hard or soft.");
    requiredString(raw.reason, out, "DEPENDENCY_REASON_REQUIRED", `${path}.reason`);
    if (!from || !to) continue;
    if (from === to) { add(out, "SELF_DEPENDENCY", path, "A skill cannot depend on itself."); continue; }
    if (!skillIds.has(from)) add(out, "DANGLING_PREREQUISITE", `${path}.prerequisiteId`, `Unknown prerequisite: ${from}.`);
    if (!skillIds.has(to)) add(out, "DANGLING_DEPENDENT_SKILL", `${path}.skillId`, `Unknown dependent skill: ${to}.`);
    const pair = `${from}\u0000${to}`;
    if (pairs.has(pair)) add(out, "DUPLICATE_DEPENDENCY", path, `Duplicate dependency ${from} -> ${to}.`);
    else pairs.add(pair);
    if (skillIds.has(from) && skillIds.has(to)) edges.get(from)?.add(to);
  }

  if (edges.size) {
    const indegree = new Map([...edges.keys()].map((id) => [id, 0]));
    for (const targets of edges.values()) for (const target of targets) indegree.set(target, (indegree.get(target) ?? 0) + 1);
    const ready = [...indegree].filter(([, degree]) => degree === 0).map(([id]) => id).sort();
    let visited = 0;
    while (ready.length) {
      const current = ready.shift();
      if (!current) break;
      visited++;
      for (const target of [...(edges.get(current) ?? [])].sort()) {
        const degree = (indegree.get(target) ?? 0) - 1;
        indegree.set(target, degree);
        if (degree === 0) { ready.push(target); ready.sort(); }
      }
    }
    if (visited !== edges.size) add(out, "DEPENDENCY_CYCLE", "dependencies", "Prerequisite relationships must form a directed acyclic graph.");
  }

  const itemIds = new Set<string>();
  for (const [i, raw] of (items ?? []).entries()) {
    const path = `contentItems[${i}]`;
    if (!isObject(raw)) { add(out, "CONTENT_ITEM_OBJECT_REQUIRED", path, "Content item must be an object."); continue; }
    const id = requiredString(raw.id, out, "CONTENT_ITEM_ID_REQUIRED", `${path}.id`);
    if (id && itemIds.has(id)) add(out, "DUPLICATE_CONTENT_ITEM_ID", `${path}.id`, `Duplicate content item id: ${id}.`);
    else if (id) itemIds.add(id);
    if (!positiveInt(raw.version)) add(out, "CONTENT_ITEM_VERSION_INVALID", `${path}.version`, "Content item version must be a positive integer.");
    if (typeof raw.difficulty !== "number" || !Number.isInteger(raw.difficulty) || raw.difficulty < 1 || raw.difficulty > 10) add(out, "CONTENT_ITEM_DIFFICULTY_INVALID", `${path}.difficulty`, "Difficulty must be an integer from 1 through 10.");
    const primary = requiredString(raw.primarySkillId, out, "PRIMARY_SKILL_ID_REQUIRED", `${path}.primarySkillId`);
    if (primary && !skillIds.has(primary)) add(out, "UNKNOWN_PRIMARY_SKILL", `${path}.primarySkillId`, `Unknown primary skill: ${primary}.`);
    if (raw.secondarySkillIds !== undefined) {
      if (!Array.isArray(raw.secondarySkillIds)) add(out, "SECONDARY_SKILL_IDS_INVALID", `${path}.secondarySkillIds`, "secondarySkillIds must be an array.");
      else {
        const seen = new Set<string>();
        for (const [j, secondary] of raw.secondarySkillIds.entries()) {
          const secondaryPath = `${path}.secondarySkillIds[${j}]`;
          if (!nonBlank(secondary)) { add(out, "SECONDARY_SKILL_ID_INVALID", secondaryPath, "Secondary skill id must be a non-empty string."); continue; }
          if (secondary === primary || seen.has(secondary)) add(out, "DUPLICATE_ITEM_SKILL_REFERENCE", secondaryPath, `Duplicate skill reference: ${secondary}.`);
          else seen.add(secondary);
          if (!skillIds.has(secondary)) add(out, "UNKNOWN_SECONDARY_SKILL", secondaryPath, `Unknown secondary skill: ${secondary}.`);
        }
      }
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path) || a.code.localeCompare(b.code));
}
