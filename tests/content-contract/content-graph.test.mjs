import assert from "node:assert/strict";
import test from "node:test";
import { validateContentGraph } from "../../packages/content-contract/src/index.ts";

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
