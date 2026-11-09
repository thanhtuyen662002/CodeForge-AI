import assert from "node:assert/strict";
import test from "node:test";
import { CONTENT_GRAPH_LIMITS, parseContentGraphBody, validateContentGraph } from "../../packages/content-contract/src/index.ts";

function validGraph() {
  return {
    schemaVersion: 1,
    version: "fuzz-v1",
    skills: [
      {
        id: "logic.sequence",
        slug: "sequence",
        domain: "logic",
        name: { vi: "Chuỗi", en: "Sequence" },
        description: "A deterministic parser-boundary fixture.",
        version: 1,
        status: "draft",
      },
    ],
    dependencies: [],
    contentItems: [
      { id: "practice.sequence.001", version: 1, difficulty: 2, primarySkillId: "logic.sequence" },
    ],
  };
}

function bodyStream(chunks) {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
}

function nestedArrays(count, leaf = 0) {
  let value = leaf;
  for (let index = 0; index < count; index++) value = [value];
  return value;
}

function seededChunks(bytes, seed) {
  let state = seed >>> 0;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };
  const chunks = [];
  for (let offset = 0; offset < bytes.length;) {
    const size = 1 + (next() % 29);
    chunks.push(bytes.slice(offset, Math.min(offset + size, bytes.length)));
    offset += size;
  }
  return chunks;
}

const encoder = new TextEncoder();
const codes = (issues) => issues.map((issue) => issue.code);

test("accepts valid Unicode JSON across deterministic seeded stream partitions", async () => {
  const graph = validGraph();
  graph.skills[0].description = "Tiếng Việt, dấu tổ hợp, emoji 🧠 và ký tự đa byte.";
  const bytes = encoder.encode(JSON.stringify(graph));

  for (let seed = 1; seed <= 24; seed++) {
    const result = await parseContentGraphBody(bodyStream(seededChunks(bytes, seed)));
    assert.equal(result.ok, true, `seed ${seed}`);
    if (result.ok) assert.deepEqual(result.graph, graph, `seed ${seed}`);
  }
});

test("rejects invalid UTF-8 when an invalid continuation byte crosses a chunk boundary", async () => {
  const result = await parseContentGraphBody(bodyStream([
    Uint8Array.of(0x7b, 0x22, 0x78, 0x22, 0x3a, 0x22, 0xc3),
    Uint8Array.of(0x28, 0x22, 0x7d),
  ]));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.issues[0].code, "CONTENT_GRAPH_BODY_INVALID_UTF8");
});

test("never throws for deterministic truncated JSON prefixes", async () => {
  const bytes = encoder.encode(JSON.stringify(validGraph()));
  const cuts = [...new Set([1, 2, 7, 15, 31, 63, 127, bytes.length - 1])];

  for (const cut of cuts) {
    const result = await parseContentGraphBody(bodyStream(seededChunks(bytes.slice(0, cut), cut)));
    assert.equal(result.ok, false, `cut ${cut}`);
    if (!result.ok) {
      assert.ok(
        ["CONTENT_GRAPH_BODY_INVALID_UTF8", "CONTENT_GRAPH_BODY_INVALID_JSON"].includes(result.issues[0].code),
        `unexpected code at cut ${cut}: ${result.issues[0].code}`,
      );
    }
  }
});

test("rejects escaped-equivalent duplicate keys at nested object paths under arrays", async () => {
  const json = JSON.stringify(validGraph()).replace(
    ',"contentItems":',
    ',"probe":[{"name":"first","\\u006eame":"last"}],"contentItems":',
  );
  const result = await parseContentGraphBody(bodyStream([encoder.encode(json)]));
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.issues[0].code, "CONTENT_GRAPH_DUPLICATE_JSON_KEY");
    assert.equal(result.issues[0].path, '$["probe"][0]["name"]');
  }
});

test("does not conflate identical member names in distinct sibling objects", async () => {
  const json = JSON.stringify(validGraph()).replace(
    ',"contentItems":',
    ',"probe":[{"name":"first"},{"name":"second"},{"name":"third"}],"contentItems":',
  );
  const result = await parseContentGraphBody(bodyStream([encoder.encode(json)]));
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(codes(result.issues).includes("UNKNOWN_FIELD"));
    assert.equal(codes(result.issues).includes("CONTENT_GRAPH_DUPLICATE_JSON_KEY"), false);
  }
});

test("accepts the configured JSON depth boundary and rejects one level beyond it", async () => {
  const atLimit = validGraph();
  atLimit.depthProbe = nestedArrays(CONTENT_GRAPH_LIMITS.maxJsonDepth - 1);
  const atLimitResult = await parseContentGraphBody(bodyStream([encoder.encode(JSON.stringify(atLimit))]));
  assert.equal(atLimitResult.ok, false);
  if (!atLimitResult.ok) {
    assert.ok(codes(atLimitResult.issues).includes("UNKNOWN_FIELD"));
    assert.equal(codes(atLimitResult.issues).includes("CONTENT_GRAPH_JSON_DEPTH_LIMIT_EXCEEDED"), false);
  }

  const overLimit = validGraph();
  overLimit.depthProbe = nestedArrays(CONTENT_GRAPH_LIMITS.maxJsonDepth);
  const overLimitResult = await parseContentGraphBody(bodyStream([encoder.encode(JSON.stringify(overLimit))]));
  assert.equal(overLimitResult.ok, false);
  if (!overLimitResult.ok) assert.equal(overLimitResult.issues[0].code, "CONTENT_GRAPH_JSON_DEPTH_LIMIT_EXCEEDED");
});

test("accepts exactly the configured body-chunk count", async () => {
  const bytes = encoder.encode(JSON.stringify(validGraph()));
  const chunks = [
    bytes,
    ...Array.from({ length: CONTENT_GRAPH_LIMITS.maxBodyChunks - 1 }, () => new Uint8Array()),
  ];
  const result = await parseContentGraphBody(bodyStream(chunks));
  assert.equal(result.ok, true);
  if (result.ok) assert.deepEqual(result.graph, validGraph());
});

test("collection limits accept the exact maximum and reject one additional entry", () => {
  const cases = [
    ["skills", CONTENT_GRAPH_LIMITS.maxSkills, "SKILLS_LIMIT_EXCEEDED"],
    ["dependencies", CONTENT_GRAPH_LIMITS.maxDependencies, "DEPENDENCIES_LIMIT_EXCEEDED"],
    ["contentItems", CONTENT_GRAPH_LIMITS.maxContentItems, "CONTENT_ITEMS_LIMIT_EXCEEDED"],
  ];

  for (const [field, limit, limitCode] of cases) {
    const graph = validGraph();
    graph[field] = Array.from({ length: limit }, () => null);
    assert.equal(codes(validateContentGraph(graph)).includes(limitCode), false, `${field} at ${limit}`);

    graph[field].push(null);
    assert.equal(codes(validateContentGraph(graph)).includes(limitCode), true, `${field} at ${limit + 1}`);
  }
});

test("string and identifier limits accept the exact maximum and reject one extra character", () => {
  const graph = validGraph();
  const identifier = "a".repeat(CONTENT_GRAPH_LIMITS.maxIdentifierLength);
  graph.skills[0].id = identifier;
  graph.contentItems[0].primarySkillId = identifier;
  graph.skills[0].slug = "s".repeat(CONTENT_GRAPH_LIMITS.maxIdentifierLength);
  graph.skills[0].domain = "d".repeat(CONTENT_GRAPH_LIMITS.maxIdentifierLength);
  graph.skills[0].description = "x".repeat(CONTENT_GRAPH_LIMITS.maxTextLength);
  graph.skills[0].name = {
    vi: "v".repeat(CONTENT_GRAPH_LIMITS.maxLocalizedNameLength),
    en: "e".repeat(CONTENT_GRAPH_LIMITS.maxLocalizedNameLength),
  };

  const exactCodes = codes(validateContentGraph(graph));
  assert.equal(exactCodes.includes("IDENTIFIER_TOO_LONG"), false);
  assert.equal(exactCodes.includes("STRING_TOO_LONG"), false);
  assert.equal(exactCodes.includes("SKILL_NAME_INVALID"), false);

  graph.skills[0].id += "a";
  graph.contentItems[0].primarySkillId = graph.skills[0].id;
  graph.skills[0].description += "x";
  graph.skills[0].name.en += "e";
  const overCodes = codes(validateContentGraph(graph));
  assert.ok(overCodes.includes("IDENTIFIER_TOO_LONG"));
  assert.ok(overCodes.includes("STRING_TOO_LONG"));
  assert.ok(overCodes.includes("SKILL_NAME_INVALID"));
});

test("secondary skill references accept the exact maximum and reject one extra reference", () => {
  const graph = validGraph();
  graph.contentItems[0].secondarySkillIds = Array.from(
    { length: CONTENT_GRAPH_LIMITS.maxSecondarySkillIdsPerItem },
    (_, index) => `extra.skill${index}`,
  );
  let resultCodes = codes(validateContentGraph(graph));
  assert.equal(resultCodes.includes("SECONDARY_SKILL_IDS_LIMIT_EXCEEDED"), false);

  graph.contentItems[0].secondarySkillIds.push("extra.skill32");
  resultCodes = codes(validateContentGraph(graph));
  assert.ok(resultCodes.includes("SECONDARY_SKILL_IDS_LIMIT_EXCEEDED"));
});
