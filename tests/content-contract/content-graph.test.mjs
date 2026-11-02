import assert from "node:assert/strict";
import test from "node:test";
import { CONTENT_GRAPH_LIMITS, validateContentGraph } from "../../packages/content-contract/src/index.ts";

function validGraph() {
  return {
    schemaVersion: 1,
    version: "taxonomy-v1",
    skills: [
      { id: "logic.sequence", slug: "sequence", domain: "problem-solving", name: { vi: "Chuỗi", en: "Sequence" }, description: "Recognizes a sequence rule.", version: 1, status: "draft" },
      { id: "programming.variables", slug: "variables", domain: "programming", name: { vi: "Biến", en: "Variables" }, description: "Stores and retrieves a value.", version: 1, status: "draft" },
      { id: "programming.conditions", slug: "conditions", domain: "programming", name: { vi: "Điều kiện", en: "Conditions" }, description: "Chooses a path from a boolean condition.", version: 1, status: "draft" },
    ],
    dependencies: [
      { prerequisiteId: "logic.sequence", skillId: "programming.variables", kind: "soft", reason: "A simple sequence supports variable tracing." },
      { prerequisiteId: "programming.variables", skillId: "programming.conditions", kind: "hard", reason: "Conditions use values and expressions." },
    ],
    contentItems: [
      { id: "python.conditions.001", version: 1, difficulty: 3, primarySkillId: "programming.conditions", secondarySkillIds: ["programming.variables"] },
    ],
  };
}

function codes(graph) {
  return validateContentGraph(graph).map((issue) => issue.code);
}

test("accepts a large disconnected graph without false cycle diagnostics", () => {
  const graph = validGraph();
  graph.skills = Array.from({ length: 10000 }, (_, index) => ({
    id: `scale.skill-${index}`,
    slug: `skill-${index}`,
    domain: "scale",
    name: { vi: `Kỹ năng ${index}`, en: `Skill ${index}` },
    description: "Synthetic disconnected skill for traversal scale.",
    version: 1,
    status: "draft",
  }));
  graph.dependencies = [];
  graph.contentItems = [];
  assert.deepEqual(validateContentGraph(graph), []);
});


test("accepts collection and string values exactly at configured limits", () => {
  const graph = validGraph();
  graph.version = "v".repeat(CONTENT_GRAPH_LIMITS.maxIdentifierLength);
  graph.skills = Array.from({ length: CONTENT_GRAPH_LIMITS.maxSkills }, (_, index) => ({
    id: `scale.skill-${index}`,
    slug: `skill-${index}`,
    domain: "scale",
    name: { vi: "v".repeat(CONTENT_GRAPH_LIMITS.maxLocalizedNameLength), en: "e".repeat(CONTENT_GRAPH_LIMITS.maxLocalizedNameLength) },
    description: "d".repeat(CONTENT_GRAPH_LIMITS.maxTextLength),
    version: 1,
    status: "draft",
  }));
  const dependencies = [];
  for (let index = 0; index < CONTENT_GRAPH_LIMITS.maxSkills - 1; index++) {
    dependencies.push({ prerequisiteId: `scale.skill-${index}`, skillId: `scale.skill-${index + 1}`, kind: "hard", reason: "r".repeat(CONTENT_GRAPH_LIMITS.maxTextLength) });
  }
  for (let index = 0; index < CONTENT_GRAPH_LIMITS.maxSkills - 2; index++) {
    dependencies.push({ prerequisiteId: `scale.skill-${index}`, skillId: `scale.skill-${index + 2}`, kind: "soft", reason: "A valid shortcut edge." });
  }
  dependencies.push(
    { prerequisiteId: "scale.skill-0", skillId: "scale.skill-3", kind: "soft", reason: "Third-hop edge A." },
    { prerequisiteId: "scale.skill-1", skillId: "scale.skill-4", kind: "soft", reason: "Third-hop edge B." },
    { prerequisiteId: "scale.skill-2", skillId: "scale.skill-5", kind: "soft", reason: "Third-hop edge C." },
  );
  assert.equal(dependencies.length, CONTENT_GRAPH_LIMITS.maxDependencies);
  graph.dependencies = dependencies;
  graph.contentItems = Array.from({ length: CONTENT_GRAPH_LIMITS.maxContentItems }, (_, index) => ({
    id: `content.item-${index}`,
    version: 1,
    difficulty: 3,
    primarySkillId: "scale.skill-0",
  }));
  assert.deepEqual(validateContentGraph(graph), []);
});

test("rejects collections above configured limits before traversal", () => {
  const skills = validGraph();
  skills.skills = Array.from({ length: CONTENT_GRAPH_LIMITS.maxSkills + 1 }, () => ({}));
  assert.ok(codes(skills).includes("SKILLS_LIMIT_EXCEEDED"));

  const dependencies = validGraph();
  dependencies.dependencies = Array.from({ length: CONTENT_GRAPH_LIMITS.maxDependencies + 1 }, () => ({}));
  assert.ok(codes(dependencies).includes("DEPENDENCIES_LIMIT_EXCEEDED"));

  const items = validGraph();
  items.contentItems = Array.from({ length: CONTENT_GRAPH_LIMITS.maxContentItems + 1 }, () => ({}));
  assert.ok(codes(items).includes("CONTENT_ITEMS_LIMIT_EXCEEDED"));
});

test("rejects overlong strings and excessive secondary skill references", () => {
  const graph = validGraph();
  graph.skills[0].id = "a".repeat(CONTENT_GRAPH_LIMITS.maxIdentifierLength + 1);
  graph.skills[0].description = "d".repeat(CONTENT_GRAPH_LIMITS.maxTextLength + 1);
  graph.skills[0].name.en = "e".repeat(CONTENT_GRAPH_LIMITS.maxLocalizedNameLength + 1);
  graph.dependencies[0].reason = "r".repeat(CONTENT_GRAPH_LIMITS.maxTextLength + 1);
  graph.contentItems[0].secondarySkillIds = Array.from(
    { length: CONTENT_GRAPH_LIMITS.maxSecondarySkillIdsPerItem + 1 },
    (_, index) => `extra.skill-${index}`,
  );
  const result = codes(graph);
  assert.ok(result.includes("IDENTIFIER_TOO_LONG"));
  assert.ok(result.includes("STRING_TOO_LONG"));
  assert.ok(result.includes("SKILL_NAME_INVALID"));
  assert.ok(result.includes("SECONDARY_SKILL_IDS_LIMIT_EXCEEDED"));
});

test("caps diagnostic output for malformed objects with many unknown fields", () => {
  const graph = validGraph();
  for (let index = 0; index < CONTENT_GRAPH_LIMITS.maxValidationIssues + 20; index++) graph[`unknown_${index}`] = true;
  const issues = validateContentGraph(graph);
  assert.ok(issues.some((issue) => issue.code === "VALIDATION_ISSUES_TRUNCATED"));
  assert.ok(issues.length <= CONTENT_GRAPH_LIMITS.maxValidationIssues + 1);
});

test("accepts a versioned acyclic graph with valid content skill references", () => {
  assert.deepEqual(validateContentGraph(validGraph()), []);
});

test("rejects duplicate skill identifiers", () => {
  const graph = validGraph();
  graph.skills.push({ ...graph.skills[0] });
  assert.ok(codes(graph).includes("DUPLICATE_SKILL_ID"));
});

test("rejects self-edges, dangling prerequisites, and dangling dependent skills", () => {
  const graph = validGraph();
  graph.dependencies.push(
    { prerequisiteId: "programming.variables", skillId: "programming.variables", kind: "hard", reason: "Invalid self edge." },
    { prerequisiteId: "missing.skill", skillId: "programming.conditions", kind: "hard", reason: "Unknown prerequisite." },
    { prerequisiteId: "logic.sequence", skillId: "missing.target", kind: "soft", reason: "Unknown target." },
  );
  const result = codes(graph);
  assert.ok(result.includes("SELF_DEPENDENCY"));
  assert.ok(result.includes("DANGLING_PREREQUISITE"));
  assert.ok(result.includes("DANGLING_DEPENDENT_SKILL"));
});

test("rejects cycles across hard and soft prerequisite edges", () => {
  const graph = validGraph();
  graph.dependencies.push({ prerequisiteId: "programming.conditions", skillId: "logic.sequence", kind: "soft", reason: "Would close a cycle." });
  assert.ok(codes(graph).includes("DEPENDENCY_CYCLE"));
});

test("rejects duplicate dependency pairs even when their kinds differ", () => {
  const graph = validGraph();
  graph.dependencies.push({ ...graph.dependencies[0], kind: "hard" });
  assert.ok(codes(graph).includes("DUPLICATE_DEPENDENCY"));
});

test("rejects difficulty outside integer range 1 through 10", () => {
  for (const difficulty of [0, 11, 1.5, "3", null]) {
    const graph = validGraph();
    graph.contentItems[0].difficulty = difficulty;
    assert.ok(codes(graph).includes("CONTENT_ITEM_DIFFICULTY_INVALID"), `expected rejection for ${String(difficulty)}`);
  }
});

test("rejects missing and unknown primary or secondary skill references", () => {
  const graph = validGraph();
  graph.contentItems[0].primarySkillId = "missing.primary";
  graph.contentItems[0].secondarySkillIds = ["missing.secondary"];
  const result = codes(graph);
  assert.ok(result.includes("UNKNOWN_PRIMARY_SKILL"));
  assert.ok(result.includes("UNKNOWN_SECONDARY_SKILL"));

  const missing = validGraph();
  delete missing.contentItems[0].primarySkillId;
  assert.ok(codes(missing).includes("PRIMARY_SKILL_ID_REQUIRED"));
});

test("rejects repeated primary/secondary references and malformed secondary lists", () => {
  const graph = validGraph();
  graph.contentItems[0].secondarySkillIds = ["programming.conditions", "programming.variables", "programming.variables"];
  assert.ok(codes(graph).includes("DUPLICATE_ITEM_SKILL_REFERENCE"));
  const malformed = validGraph();
  malformed.contentItems[0].secondarySkillIds = "programming.variables";
  assert.ok(codes(malformed).includes("SECONDARY_SKILL_IDS_INVALID"));
});

test("rejects malformed skill metadata, invalid versions, status and graph schema", () => {
  const graph = validGraph();
  graph.schemaVersion = 2;
  graph.version = " ";
  graph.skills[0].name = { vi: "Chuỗi" };
  graph.skills[0].version = 0;
  graph.skills[0].status = "approved";
  const result = codes(graph);
  assert.ok(result.includes("GRAPH_SCHEMA_VERSION_INVALID"));
  assert.ok(result.includes("GRAPH_VERSION_REQUIRED"));
  assert.ok(result.includes("SKILL_NAME_INVALID"));
  assert.ok(result.includes("SKILL_VERSION_INVALID"));
  assert.ok(result.includes("SKILL_STATUS_INVALID"));
});

test("rejects duplicate content item ids and invalid item versions", () => {
  const graph = validGraph();
  graph.contentItems.push({ ...graph.contentItems[0], version: 0 });
  const result = codes(graph);
  assert.ok(result.includes("DUPLICATE_CONTENT_ITEM_ID"));
  assert.ok(result.includes("CONTENT_ITEM_VERSION_INVALID"));
});

test("rejects unsafe integer versions rather than accepting imprecise JavaScript numbers", () => {
  for (const version of [Number.MAX_SAFE_INTEGER + 1, 1e100]) {
    const graph = validGraph();
    graph.skills[0].version = version;
    graph.contentItems[0].version = version;
    const result = codes(graph);
    assert.ok(result.includes("SKILL_VERSION_INVALID"), `expected unsafe skill version rejection for ${String(version)}`);
    assert.ok(result.includes("CONTENT_ITEM_VERSION_INVALID"), `expected unsafe item version rejection for ${String(version)}`);
  }
});

test("rejects unknown fields at graph and nested levels, including hidden-answer-like fields", () => {
  const graph = validGraph();
  graph.privateAnswerKey = "synthetic-secret";
  graph.skills[0].internalNote = "not part of the public graph";
  graph.skills[0].name.hiddenAnswer = "synthetic-secret";
  graph.dependencies[0].weight = 999;
  graph.contentItems[0].expectedOutput = "synthetic-secret";

  const issues = validateContentGraph(graph).filter((issue) => issue.code === "UNKNOWN_FIELD");
  const paths = issues.map((issue) => issue.path);
  assert.equal(issues.length, 5);
  assert.ok(paths.includes("$.privateAnswerKey"));
  assert.ok(paths.includes("skills[0].internalNote"));
  assert.ok(paths.includes("skills[0].name.hiddenAnswer"));
  assert.ok(paths.includes("dependencies[0].weight"));
  assert.ok(paths.includes("contentItems[0].expectedOutput"));
});

test("returns deterministic issues without mutating the supplied graph", () => {
  const graph = validGraph();
  graph.dependencies.push({ prerequisiteId: "missing", skillId: "programming.conditions", kind: "hard", reason: "Bad edge." });
  const before = structuredClone(graph);
  const first = validateContentGraph(graph);
  const second = validateContentGraph(graph);
  assert.deepEqual(first, second);
  assert.deepEqual(graph, before);
});

test("rejects non-object roots and missing graph collections", () => {
  assert.equal(validateContentGraph(null)[0].code, "GRAPH_OBJECT_REQUIRED");
  const result = codes({ schemaVersion: 1, version: "v1", skills: [], dependencies: "bad", contentItems: {} });
  assert.ok(result.includes("SKILLS_EMPTY"));
  assert.ok(result.includes("DEPENDENCIES_REQUIRED"));
  assert.ok(result.includes("CONTENT_ITEMS_REQUIRED"));
});

test("rejects NUL identifiers and does not conflate distinct dependency pairs", () => {
  const graph = validGraph();
  graph.skills = [
    { ...graph.skills[0], id: "a\u0000b" },
    { ...graph.skills[1], id: "c" },
    { ...graph.skills[2], id: "a" },
    { ...graph.skills[2], id: "b\u0000c" },
  ];
  graph.dependencies = [
    { prerequisiteId: "a\u0000b", skillId: "c", kind: "hard", reason: "First distinct edge." },
    { prerequisiteId: "a", skillId: "b\u0000c", kind: "soft", reason: "Second distinct edge." },
  ];
  graph.contentItems = [
    { id: "practice.item.001", version: 1, difficulty: 2, primarySkillId: "c" },
  ];

  const issues = validateContentGraph(graph);
  assert.ok(issues.filter((issue) => issue.code === "IDENTIFIER_NUL_FORBIDDEN").length >= 4);
  assert.equal(issues.some((issue) => issue.code === "DUPLICATE_DEPENDENCY"), false);
});


test("rejects C0/C1 controls across skill and content identifiers", () => {
  for (const control of ["\u0001", "\u001F", "\u007F", "\u0085", "\u009F"]) {
    const graph = validGraph();
    graph.skills[0].id = `logic.${control}sequence`;
    graph.skills[1].slug = `var${control}iables`;
    graph.skills[2].domain = `programming${control}domain`;
    graph.contentItems[0].id = `python.conditions${control}001`;
    const issues = validateContentGraph(graph);
    assert.equal(
      issues.filter((issue) => issue.code === "IDENTIFIER_CONTROL_CHARACTER_FORBIDDEN").length,
      4,
      `expected all four identifiers to reject control U+${control.charCodeAt(0).toString(16).padStart(4, "0")}`,
    );
  }
});

test("requires canonical lowercase dotted or kebab identifier segments", () => {
  const invalidIds = ["Logic.Sequence", "logic..sequence", "logic_sequence", "-logic", "logic-", "logic.-sequence"];
  for (const id of invalidIds) {
    const graph = validGraph();
    graph.skills[0].id = id;
    assert.ok(codes(graph).includes("IDENTIFIER_FORMAT_INVALID"), `expected rejection for ${JSON.stringify(id)}`);
  }

  const graph = validGraph();
  graph.skills[0].slug = "Bad_slug";
  graph.skills[1].domain = "programming..core";
  const result = codes(graph);
  assert.ok(result.includes("IDENTIFIER_FORMAT_INVALID"));
});

test("sorts diagnostics by stable code-unit order rather than host locale", () => {
  const graph = validGraph();
  graph["é"] = true;
  graph.z = true;
  graph.a = true;
  const paths = validateContentGraph(graph)
    .filter((issue) => issue.code === "UNKNOWN_FIELD")
    .map((issue) => issue.path);
  assert.deepEqual(paths, ["$.a", "$.z", "$.é"]);
});
