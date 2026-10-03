/** Pure domain primitives. Callers must authenticate, authorize and load server-owned facts. */
export interface Skill {
  readonly id: string;
  readonly prerequisites: readonly string[];
}

export function validateSkillGraph(skills: readonly Skill[]): void {
  const graph = new Map<string, readonly string[]>();
  for (const skill of skills) {
    if (!skill.id || graph.has(skill.id)) throw new Error('invalid_or_duplicate_skill');
    if (new Set(skill.prerequisites).size !== skill.prerequisites.length) {
      throw new Error('duplicate_prerequisite');
    }
    graph.set(skill.id, skill.prerequisites);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(id: string): void {
    if (visiting.has(id)) throw new Error('skill_cycle');
    if (visited.has(id)) return;
    const dependencies = graph.get(id);
    if (!dependencies) throw new Error('missing_prerequisite');
    visiting.add(id);
    for (const prerequisite of dependencies) visit(prerequisite);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of graph.keys()) visit(id);
}

export interface Observation {
  readonly id: string;
  readonly skillId: string;
  readonly familyId: string;
  readonly sessionId: string;
  readonly observedAt: number;
  readonly source: 'server' | 'browser';
  readonly correct: boolean;
  readonly assisted: boolean;
  readonly solutionViewed: boolean;
  readonly delayedCheck: boolean;
}

export interface EvidenceSummary {
  readonly count: number;
  readonly successes: number;
  readonly sessions: number;
  readonly observedScore: number | null;
  readonly evidenceLevel: 'unknown' | 'insufficient' | 'observed';
  /** Not a final mastery decision: caller must also evaluate prerequisites and policy. */
  readonly masteryCandidate: boolean;
}

function assertFinite(...values: number[]): void {
  if (values.some((value) => !Number.isFinite(value))) throw new Error('invalid_time');
}

/** Window bounds and trusted tags must be derived by the server, never by a learner. */
export function summarizeEvidence(
  observations: readonly Observation[],
  skillId: string,
  windowStart: number,
  windowEnd: number,
): EvidenceSummary {
  assertFinite(windowStart, windowEnd);
  if (!skillId || windowEnd <= windowStart) throw new Error('invalid_window');
  const unique = new Map<string, Observation>();
  const signatures = new Map<string, string>();
  for (const observation of observations) {
    assertFinite(observation.observedAt);
    if (!observation.id || !observation.skillId || !observation.familyId || !observation.sessionId) {
      throw new Error('invalid_observation');
    }
    if (!['server', 'browser'].includes(observation.source) ||
        [observation.correct, observation.assisted, observation.solutionViewed, observation.delayedCheck]
          .some((value) => typeof value !== 'boolean')) throw new Error('invalid_observation');
    const signature = JSON.stringify([
      observation.skillId, observation.familyId, observation.sessionId, observation.observedAt,
      observation.source, observation.correct, observation.assisted,
      observation.solutionViewed, observation.delayedCheck,
    ]);
    const previous = signatures.get(observation.id);
    if (previous !== undefined && previous !== signature) throw new Error('conflicting_event');
    signatures.set(observation.id, signature);
    unique.set(observation.id, observation);
  }
  const eligible = [...unique.values()]
    .filter((observation) => observation.skillId === skillId &&
      observation.observedAt >= windowStart && observation.observedAt < windowEnd &&
      observation.source === 'server' && !observation.assisted && !observation.solutionViewed)
    .sort((a, b) => a.observedAt - b.observedAt || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const families = new Map<string, Observation>();
  for (const observation of eligible) {
    if (!families.has(observation.familyId)) families.set(observation.familyId, observation);
  }
  const evidence = [...families.values()];
  const count = evidence.length;
  const successes = evidence.filter((observation) => observation.correct).length;
  const sessions = new Set(evidence.map((observation) => observation.sessionId)).size;
  const observedScore = count === 0 ? null : (1 + successes) / (2 + count);
  return {
    count, successes, sessions, observedScore,
    evidenceLevel: count === 0 ? 'unknown' : count < 5 ? 'insufficient' : 'observed',
    masteryCandidate: count >= 5 && observedScore !== null && observedScore >= 0.8 &&
      sessions >= 2 && evidence.some((observation) => observation.delayedCheck && observation.correct),
  };
}

/** receivedAt is authoritative server receipt time; deadline is exclusive. */
export function classifySubmission(
  startedAt: number,
  deadlineAt: number,
  receivedAt: number,
): 'accepted' | 'not_started' | 'expired' {
  assertFinite(startedAt, deadlineAt, receivedAt);
  if (deadlineAt <= startedAt) throw new Error('invalid_deadline');
  if (receivedAt < startedAt) return 'not_started';
  return receivedAt >= deadlineAt ? 'expired' : 'accepted';
}

/** Exact-set grading. Partial-credit rubrics require a separate versioned policy. */
export function scoreSelection(
  options: readonly string[],
  correct: readonly string[],
  selected: readonly string[],
): 0 | 1 {
  const optionSet = new Set(options);
  if (optionSet.size !== options.length || options.some((id) => !id) ||
      correct.length === 0 || new Set(correct).size !== correct.length ||
      correct.some((id) => !optionSet.has(id))) throw new Error('invalid_question');
  if (new Set(selected).size !== selected.length || selected.some((id) => !optionSet.has(id))) {
    throw new Error('invalid_selection');
  }
  return selected.length === correct.length && correct.every((id) => selected.includes(id)) ? 1 : 0;
}

export type Cell = string | number | boolean | null;
/** Primitive exact comparator; not a complete PostgreSQL type/decimal/collation adapter. */
export function compareRows(
  actual: readonly (readonly Cell[])[],
  expected: readonly (readonly Cell[])[],
  ordered = false,
): boolean {
  function encode(rows: readonly (readonly Cell[])[]): string[] {
    if (rows.length > 10000) throw new Error('too_many_rows');
    return rows.map((row) => {
      for (const value of row) {
        if (value !== null && typeof value !== 'string' && typeof value !== 'boolean' &&
            (typeof value !== 'number' || !Number.isFinite(value))) throw new Error('invalid_cell');
      }
      return JSON.stringify(row);
    });
  }
  const a = encode(actual);
  const b = encode(expected);
  if (!ordered) { a.sort(); b.sort(); }
  return a.length === b.length && a.every((row, index) => row === b[index]);
}

export {
  evaluateEnvironmentReadiness,
  parseSupabaseProjectRef,
} from './environment-readiness.js';
export type {
  DeploymentEnvironment,
  EnvironmentReadiness,
  EnvironmentReadinessInput,
  VercelEnvironment,
} from './environment-readiness.js';
