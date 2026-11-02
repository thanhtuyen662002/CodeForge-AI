export type SkillStatus = "draft" | "published" | "retired";
export type DependencyKind = "hard" | "soft";

export interface SkillNode { id: string; slug: string; domain: string; name: { vi: string; en: string }; description: string; version: number; status: SkillStatus }
export interface SkillDependency { prerequisiteId: string; skillId: string; kind: DependencyKind; reason: string }
export interface ContentItemReference { id: string; version: number; difficulty: number; primarySkillId: string; secondarySkillIds?: string[] }
export interface ContentGraph { schemaVersion: 1; version: string; skills: SkillNode[]; dependencies: SkillDependency[]; contentItems: ContentItemReference[] }
export interface ValidationIssue { code: string; path: string; message: string }

/**
 * The request boundary must enforce maxJsonBytes before JSON.parse. This pure
 * validator also bounds decoded collections, strings, and diagnostic output.
 */
export const CONTENT_GRAPH_LIMITS = Object.freeze({
  maxJsonBytes: 1_048_576,
  maxJsonDepth: 128,
  maxBodyChunks: 16_384,
  maxSkills: 10_000,
  maxDependencies: 20_000,
  maxContentItems: 20_000,
  maxSecondarySkillIdsPerItem: 32,
  maxIdentifierLength: 128,
  maxTextLength: 4_096,
  maxLocalizedNameLength: 256,
  maxValidationIssues: 1_000,
});

const statuses = new Set<SkillStatus>(["draft", "published", "retired"]);
const kinds = new Set<DependencyKind>(["hard", "soft"]);
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const nonBlank = (value: unknown, maxLength: number = CONTENT_GRAPH_LIMITS.maxTextLength): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= maxLength && value.trim() === value;
const positiveInt = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const add = (out: ValidationIssue[], code: string, path: string, message: string): void => {
  if (out.length < CONTENT_GRAPH_LIMITS.maxValidationIssues) {
    out.push({ code, path, message });
  } else if (out.length === CONTENT_GRAPH_LIMITS.maxValidationIssues) {
    out.push({ code: "VALIDATION_ISSUES_TRUNCATED", path: "$", message: "Additional validation issues were omitted after the configured diagnostic limit." });
  }
};
const compareText = (left: string, right: string): number => left < right ? -1 : left > right ? 1 : 0;

function rejectUnknownFields(value: Record<string, unknown>, allowed: string[], out: ValidationIssue[], path: string): void {
  const allowedFields = new Set(allowed);
  for (const key of Object.keys(value)) {
    if (!allowedFields.has(key)) add(out, "UNKNOWN_FIELD", `${path}.${key}`, `Unexpected field: ${key}.`);
  }
}

function requiredString(
  value: unknown,
  out: ValidationIssue[],
  code: string,
  path: string,
  maxLength: number = CONTENT_GRAPH_LIMITS.maxTextLength,
  tooLongCode = "STRING_TOO_LONG",
): string | undefined {
  if (typeof value !== "string" || value.length === 0 || value.trim() !== value) {
    add(out, code, path, "A non-empty string is required.");
    return undefined;
  }
  if (value.length > maxLength) {
    add(out, tooLongCode, path, `String must not exceed ${maxLength} characters.`);
    return undefined;
  }
  return value;
}

function readBoundedArray(
  value: unknown,
  out: ValidationIssue[],
  requiredCode: string,
  limitCode: string,
  path: string,
  maxLength: number,
): unknown[] | null {
  if (!Array.isArray(value)) {
    add(out, requiredCode, path, `${path} must be an array.`);
    return null;
  }
  if (value.length > maxLength) {
    add(out, limitCode, path, `${path} must contain at most ${maxLength} entries.`);
    return null;
  }
  return value;
}

function requiredIdentifier(value: unknown, out: ValidationIssue[], code: string, path: string): string | undefined {
  const identifier = requiredString(value, out, code, path, CONTENT_GRAPH_LIMITS.maxIdentifierLength, "IDENTIFIER_TOO_LONG");
  if (identifier === undefined) return undefined;
  if (identifier.includes(String.fromCharCode(0))) {
    add(out, "IDENTIFIER_NUL_FORBIDDEN", path, "Identifiers must not contain U+0000.");
    return undefined;
  }
  if (/[\u0001-\u001F\u007F-\u009F]/u.test(identifier)) {
    add(out, "IDENTIFIER_CONTROL_CHARACTER_FORBIDDEN", path, "Identifiers must not contain C0/C1 control characters.");
    return undefined;
  }
  if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u.test(identifier)) {
    add(out, "IDENTIFIER_FORMAT_INVALID", path, "Identifiers must use lowercase ASCII letters and digits separated by single dots or hyphens.");
    return undefined;
  }
  return identifier;
}

/**
 * Structural validation only; it does not certify quality, provenance,
 * licensing, human review, or learning efficacy.
 */
export function validateContentGraph(input: unknown): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  if (!isObject(input)) return [{ code: "GRAPH_OBJECT_REQUIRED", path: "$", message: "Content graph must be an object." }];
  rejectUnknownFields(input, ["schemaVersion", "version", "skills", "dependencies", "contentItems"], out, "$");
  if (input.schemaVersion !== 1) add(out, "GRAPH_SCHEMA_VERSION_INVALID", "schemaVersion", "schemaVersion must be 1.");
  requiredString(input.version, out, "GRAPH_VERSION_REQUIRED", "version", CONTENT_GRAPH_LIMITS.maxIdentifierLength);

  const skills = readBoundedArray(input.skills, out, "SKILLS_REQUIRED", "SKILLS_LIMIT_EXCEEDED", "skills", CONTENT_GRAPH_LIMITS.maxSkills);
  const dependencies = readBoundedArray(input.dependencies, out, "DEPENDENCIES_REQUIRED", "DEPENDENCIES_LIMIT_EXCEEDED", "dependencies", CONTENT_GRAPH_LIMITS.maxDependencies);
  const items = readBoundedArray(input.contentItems, out, "CONTENT_ITEMS_REQUIRED", "CONTENT_ITEMS_LIMIT_EXCEEDED", "contentItems", CONTENT_GRAPH_LIMITS.maxContentItems);
  if (skills && !skills.length) add(out, "SKILLS_EMPTY", "skills", "At least one skill is required.");

  const skillIds = new Set<string>();
  for (const [i, raw] of (skills ?? []).entries()) {
    const path = `skills[${i}]`;
    if (!isObject(raw)) { add(out, "SKILL_OBJECT_REQUIRED", path, "Skill must be an object."); continue; }
    rejectUnknownFields(raw, ["id", "slug", "domain", "name", "description", "version", "status"], out, path);
    const id = requiredIdentifier(raw.id, out, "SKILL_ID_REQUIRED", `${path}.id`);
    if (id && skillIds.has(id)) add(out, "DUPLICATE_SKILL_ID", `${path}.id`, `Duplicate skill id: ${id}.`);
    else if (id) skillIds.add(id);
    requiredIdentifier(raw.slug, out, "SKILL_SLUG_REQUIRED", `${path}.slug`);
    requiredIdentifier(raw.domain, out, "SKILL_DOMAIN_REQUIRED", `${path}.domain`);
    const name = raw.name;
    if (!isObject(name) || !nonBlank(name.vi, CONTENT_GRAPH_LIMITS.maxLocalizedNameLength) || !nonBlank(name.en, CONTENT_GRAPH_LIMITS.maxLocalizedNameLength)) add(out, "SKILL_NAME_INVALID", `${path}.name`, "Both vi and en names are required and must fit the configured length limit.");
    else rejectUnknownFields(name, ["vi", "en"], out, `${path}.name`);
    requiredString(raw.description, out, "SKILL_DESCRIPTION_REQUIRED", `${path}.description`, CONTENT_GRAPH_LIMITS.maxTextLength);
    if (!positiveInt(raw.version)) add(out, "SKILL_VERSION_INVALID", `${path}.version`, "Skill version must be a positive integer.");
    if (typeof raw.status !== "string" || !statuses.has(raw.status as SkillStatus)) add(out, "SKILL_STATUS_INVALID", `${path}.status`, "Status must be draft, published, or retired.");
  }

  const edges = new Map([...skillIds].map((id) => [id, new Set<string>()]));
  const pairs = new Set<string>();
  for (const [i, raw] of (dependencies ?? []).entries()) {
    const path = `dependencies[${i}]`;
    if (!isObject(raw)) { add(out, "DEPENDENCY_OBJECT_REQUIRED", path, "Dependency must be an object."); continue; }
    rejectUnknownFields(raw, ["prerequisiteId", "skillId", "kind", "reason"], out, path);
    const from = requiredIdentifier(raw.prerequisiteId, out, "PREREQUISITE_ID_REQUIRED", `${path}.prerequisiteId`);
    const to = requiredIdentifier(raw.skillId, out, "DEPENDENT_SKILL_ID_REQUIRED", `${path}.skillId`);
    if (typeof raw.kind !== "string" || !kinds.has(raw.kind as DependencyKind)) add(out, "DEPENDENCY_KIND_INVALID", `${path}.kind`, "Kind must be hard or soft.");
    requiredString(raw.reason, out, "DEPENDENCY_REASON_REQUIRED", `${path}.reason`, CONTENT_GRAPH_LIMITS.maxTextLength);
    if (!from || !to) continue;
    if (from === to) { add(out, "SELF_DEPENDENCY", path, "A skill cannot depend on itself."); continue; }
    if (!skillIds.has(from)) add(out, "DANGLING_PREREQUISITE", `${path}.prerequisiteId`, `Unknown prerequisite: ${from}.`);
    if (!skillIds.has(to)) add(out, "DANGLING_DEPENDENT_SKILL", `${path}.skillId`, `Unknown dependent skill: ${to}.`);
    const pair = JSON.stringify([from, to]);
    if (pairs.has(pair)) add(out, "DUPLICATE_DEPENDENCY", path, `Duplicate dependency ${from} -> ${to}.`);
    else pairs.add(pair);
    if (skillIds.has(from) && skillIds.has(to)) edges.get(from)?.add(to);
  }

  if (edges.size) {
    const indegree = new Map([...edges.keys()].map((id) => [id, 0]));
    for (const targets of edges.values()) for (const target of targets) indegree.set(target, (indegree.get(target) ?? 0) + 1);
    // Traversal order is not observable; diagnostics are sorted below. A stack avoids repeated shifts and re-sorts.
    const ready = [...indegree].filter(([, degree]) => degree === 0).map(([id]) => id);
    let visited = 0;
    while (ready.length) {
      const current = ready.pop();
      if (current === undefined) break;
      visited++;
      for (const target of edges.get(current) ?? []) {
        const degree = (indegree.get(target) ?? 0) - 1;
        indegree.set(target, degree);
        if (degree === 0) ready.push(target);
      }
    }
    if (visited !== edges.size) add(out, "DEPENDENCY_CYCLE", "dependencies", "Prerequisite relationships must form a directed acyclic graph.");
  }

  const itemIds = new Set<string>();
  for (const [i, raw] of (items ?? []).entries()) {
    const path = `contentItems[${i}]`;
    if (!isObject(raw)) { add(out, "CONTENT_ITEM_OBJECT_REQUIRED", path, "Content item must be an object."); continue; }
    rejectUnknownFields(raw, ["id", "version", "difficulty", "primarySkillId", "secondarySkillIds"], out, path);
    const id = requiredIdentifier(raw.id, out, "CONTENT_ITEM_ID_REQUIRED", `${path}.id`);
    if (id && itemIds.has(id)) add(out, "DUPLICATE_CONTENT_ITEM_ID", `${path}.id`, `Duplicate content item id: ${id}.`);
    else if (id) itemIds.add(id);
    if (!positiveInt(raw.version)) add(out, "CONTENT_ITEM_VERSION_INVALID", `${path}.version`, "Content item version must be a positive integer.");
    if (typeof raw.difficulty !== "number" || !Number.isInteger(raw.difficulty) || raw.difficulty < 1 || raw.difficulty > 10) add(out, "CONTENT_ITEM_DIFFICULTY_INVALID", `${path}.difficulty`, "Difficulty must be an integer from 1 through 10.");
    const primary = requiredIdentifier(raw.primarySkillId, out, "PRIMARY_SKILL_ID_REQUIRED", `${path}.primarySkillId`);
    if (primary && !skillIds.has(primary)) add(out, "UNKNOWN_PRIMARY_SKILL", `${path}.primarySkillId`, `Unknown primary skill: ${primary}.`);
    if (raw.secondarySkillIds !== undefined) {
      if (!Array.isArray(raw.secondarySkillIds)) add(out, "SECONDARY_SKILL_IDS_INVALID", `${path}.secondarySkillIds`, "secondarySkillIds must be an array.");
      else if (raw.secondarySkillIds.length > CONTENT_GRAPH_LIMITS.maxSecondarySkillIdsPerItem) add(out, "SECONDARY_SKILL_IDS_LIMIT_EXCEEDED", `${path}.secondarySkillIds`, `secondarySkillIds must contain at most ${CONTENT_GRAPH_LIMITS.maxSecondarySkillIdsPerItem} entries.`);
      else {
        const seen = new Set<string>();
        for (const [j, secondary] of raw.secondarySkillIds.entries()) {
          const secondaryPath = `${path}.secondarySkillIds[${j}]`;
          const secondaryId = requiredIdentifier(secondary, out, "SECONDARY_SKILL_ID_INVALID", secondaryPath);
          if (!secondaryId) continue;
          if (secondaryId === primary || seen.has(secondaryId)) add(out, "DUPLICATE_ITEM_SKILL_REFERENCE", secondaryPath, `Duplicate skill reference: ${secondaryId}.`);
          else seen.add(secondaryId);
          if (!skillIds.has(secondaryId)) add(out, "UNKNOWN_SECONDARY_SKILL", secondaryPath, `Unknown secondary skill: ${secondaryId}.`);
        }
      }
    }
  }
  return out.sort((a, b) => compareText(a.path, b.path) || compareText(a.code, b.code));
}


export type ContentGraphBodyResult =
  | { ok: true; graph: ContentGraph }
  | { ok: false; issues: ValidationIssue[] };

/**
 * Read an HTTP request body incrementally, enforce the UTF-8 byte limit before
 * JSON.parse, then run the structural validator. Route Handlers should pass
 * request.body directly; do not call request.json() or request.text() first.
 */
type JsonScanResult = { duplicatePath: string } | { depthExceeded: true } | null;

/**
 * Scan bounded raw JSON before object materialization. JSON.parse uses
 * last-key-wins semantics, so a post-parse object walk cannot detect duplicate
 * or escaped-equivalent member names. Malformed syntax is left to JSON.parse;
 * this scanner only reports duplicates and an explicit nesting limit.
 */
function scanJsonForDuplicateKeys(source: string): JsonScanResult {
  let index = 0;
  let depthExceeded = false;
  const whitespace = (): void => {
    while (source[index] === " " || source[index] === "\t" || source[index] === "\n" || source[index] === "\r") index++;
  };
  const readString = (): string => {
    const start = index;
    if (source[index] !== '"') throw new Error("Expected a JSON string.");
    index++;
    while (index < source.length) {
      const character = source[index++];
      if (character === '"') return JSON.parse(source.slice(start, index)) as string;
      if (character === "\\") {
        if (index >= source.length) throw new Error("Incomplete JSON escape.");
        const escaped = source[index++];
        if (escaped === "u") {
          const hex = source.slice(index, index + 4);
          if (!/^[0-9a-fA-F]{4}$/u.test(hex)) throw new Error("Invalid JSON Unicode escape.");
          index += 4;
        } else if (!'"\\/bfnrt'.includes(escaped)) {
          throw new Error("Invalid JSON escape.");
        }
      } else if (character.charCodeAt(0) < 0x20) {
        throw new Error("Unescaped control character in JSON string.");
      }
    }
    throw new Error("Unterminated JSON string.");
  };
  const isDelimiter = (character: string | undefined): boolean =>
    character === " " || character === "\t" || character === "\n" || character === "\r" ||
    character === "," || character === "]" || character === "}";
  const parseValue = (path: string, depth: number): string | null => {
    whitespace();
    if (depth > CONTENT_GRAPH_LIMITS.maxJsonDepth) {
      depthExceeded = true;
      throw new Error("JSON nesting limit exceeded.");
    }
    const character = source[index];
    if (character === "{") {
      index++;
      whitespace();
      const seen = new Set<string>();
      if (source[index] === "}") { index++; return null; }
      while (true) {
        whitespace();
        const key = readString();
        const keyPath = path + "[" + JSON.stringify(key) + "]";
        if (seen.has(key)) return keyPath;
        seen.add(key);
        whitespace();
        if (source[index++] !== ":") throw new Error("Expected a JSON object colon.");
        const nestedDuplicate = parseValue(keyPath, depth + 1);
        if (nestedDuplicate !== null) return nestedDuplicate;
        whitespace();
        if (source[index] === "}") { index++; return null; }
        if (source[index++] !== ",") throw new Error("Expected a JSON object comma.");
      }
    }
    if (character === "[") {
      index++;
      whitespace();
      if (source[index] === "]") { index++; return null; }
      let itemIndex = 0;
      while (true) {
        const nestedDuplicate = parseValue(path + "[" + itemIndex + "]", depth + 1);
        if (nestedDuplicate !== null) return nestedDuplicate;
        itemIndex++;
        whitespace();
        if (source[index] === "]") { index++; return null; }
        if (source[index++] !== ",") throw new Error("Expected a JSON array comma.");
      }
    }
    if (character === '"') { readString(); return null; }
    const start = index;
    while (index < source.length && !isDelimiter(source[index])) index++;
    if (index === start) throw new Error("Expected a JSON value.");
    return null;
  };
  try {
    whitespace();
    const duplicatePath = parseValue("$", 0);
    if (duplicatePath !== null) return { duplicatePath };
    whitespace();
    if (index !== source.length) throw new Error("Trailing JSON data.");
    return null;
  } catch {
    return depthExceeded ? { depthExceeded: true } : null;
  }
}

export async function parseContentGraphBody(
  body: ReadableStream<Uint8Array> | null,
): Promise<ContentGraphBodyResult> {
  const issue = (code: string, message: string, path = "$"): ContentGraphBodyResult => ({
    ok: false,
    issues: [{ code, path, message }],
  });
  if (!body) return issue("CONTENT_GRAPH_BODY_REQUIRED", "A request body is required.");

  let reader: ReadableStreamDefaultReader<Uint8Array>;
  try {
    reader = body.getReader();
  } catch {
    return issue("CONTENT_GRAPH_BODY_READ_FAILED", "The request body stream is not available for reading.");
  }
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let json = "";
  let byteLength = 0;
  let chunkCount = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunkCount++;
      if (chunkCount > CONTENT_GRAPH_LIMITS.maxBodyChunks) {
        try { await reader.cancel(); } catch { /* best-effort cancellation */ }
        return issue("CONTENT_GRAPH_BODY_CHUNK_LIMIT_EXCEEDED", "The request body contains too many chunks.");
      }
      byteLength += value.byteLength;
      if (byteLength > CONTENT_GRAPH_LIMITS.maxJsonBytes) {
        try { await reader.cancel(); } catch { /* best-effort cancellation */ }
        return issue("CONTENT_GRAPH_BODY_TOO_LARGE", `The request body must not exceed ${CONTENT_GRAPH_LIMITS.maxJsonBytes} bytes.`);
      }
      try {
        json += decoder.decode(value, { stream: true });
      } catch {
        try { await reader.cancel(); } catch { /* best-effort cancellation */ }
        return issue("CONTENT_GRAPH_BODY_INVALID_UTF8", "The request body must be valid UTF-8.");
      }
    }
  } catch {
    return issue("CONTENT_GRAPH_BODY_READ_FAILED", "The request body could not be read completely.");
  } finally {
    reader.releaseLock();
  }

  try {
    json += decoder.decode();
  } catch {
    return issue("CONTENT_GRAPH_BODY_INVALID_UTF8", "The request body must be valid UTF-8.");
  }

  const scan = scanJsonForDuplicateKeys(json);
  if (scan && "depthExceeded" in scan) {
    return issue("CONTENT_GRAPH_JSON_DEPTH_LIMIT_EXCEEDED", `JSON nesting must not exceed ${CONTENT_GRAPH_LIMITS.maxJsonDepth} levels.`);
  }
  if (scan && "duplicatePath" in scan) {
    return issue("CONTENT_GRAPH_DUPLICATE_JSON_KEY", "JSON object member names must be unique.", scan.duplicatePath);
  }

  let input: unknown;
  try {
    input = JSON.parse(json) as unknown;
  } catch {
    return issue("CONTENT_GRAPH_BODY_INVALID_JSON", "The request body must contain valid JSON.");
  }

  const issues = validateContentGraph(input);
  if (issues.length) return { ok: false, issues };
  return { ok: true, graph: input as ContentGraph };
}
