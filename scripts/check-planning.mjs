// Documentation integrity only. No network, package install, or learner-code execution.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFileSync(path.join(root, name), 'utf8').replace(/^\uFEFF/, '');
const json = name => JSON.parse(read(name));
const walk = dir => readdirSync(path.join(root, dir), { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const docs = ['README.md', 'AGENTS.md', ...walk('docs').filter(f => f.endsWith('.md'))];
let localLinks = 0;
for (const file of docs) {
  for (const match of read(file).matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    const relative = decodeURIComponent(target.split('#')[0]);
    const resolved = path.resolve(root, path.dirname(file), relative);
    assert.ok(existsSync(resolved), `${file}: broken local link ${target}`);
    localLinks++;
  }
}

const state = json('docs/PROJECT_STATE.yaml');
const model = json('docs/research/economics-model.json');
json('docs/research/repository-snapshot.json');
const sum = values => values.reduce((a, b) => a + b, 0);
const close = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-8, `${label}: ${a} != ${b}`);
const cost = (unit, price) => unit.platform + unit.storage + unit.bandwidth + unit.observability
  + unit.support_minutes * model.labour_per_hour / 60 + unit.abuse
  + (price ? price * (model.fee_rate_assumption + model.refund_reserve_rate) + model.fee_fixed_assumption : 0);
close(cost(model.free_active, 0), model.unit_economic_costs_documented.free, 'free cost');
close(cost(model.pro, model.price_pro_hypothetical), model.unit_economic_costs_documented.pro, 'Pro cost');
close(cost(model.pack, model.price_pack), model.unit_economic_costs_documented.pack, 'pack cost');
close(sum(Object.values(model.total_hours_by_work)), state.total_90_day_limits.hours, 'hours cap');
close(sum(Object.values(model.cash_allocation)), state.total_90_day_limits.cash_usd, 'cash cap');
close(model.price_pack, state.price_hypothesis_usd, 'price');
close(model.total_hours_by_work.p0, state.p0_limits.hours, 'P0 hours');
close(model.cash_allocation.p0, state.p0_limits.cash_usd, 'P0 cash');
close(sum(model.score_weights), 33, 'score weights');
for (const thesis of model.theses) {
  assert.equal(thesis.scores.length, model.score_weights.length);
  close(sum(thesis.scores.map((score, i) => score * model.score_weights[i])), thesis.weighted_total, thesis.id);
}

const reconciliation = read('docs/RED_TEAM.md');
for (const [prefix, count] of [['IC', 20], ['OP', 22]]) {
  const raw = read(`docs/reviews/${prefix === 'IC' ? 'INVESTMENT' : 'OPERATIONS'}_RED_TEAM.md`);
  for (let i = 1; i <= count; i++) {
    const id = `${prefix}-${String(i).padStart(2, '0')}`;
    assert.ok(raw.includes(`### ${id}`), `Missing raw finding ${id}`);
    assert.equal((reconciliation.match(new RegExp(`\\| ${id} \\|`, 'g')) || []).length, 1, `Missing/duplicate disposition ${id}`);
  }
}
assert.equal((read('docs/RISK_REGISTER.md').match(/^\| R\d\d \|/gm) || []).length, 32);
const ledger = read('docs/MARKET_RESEARCH.md');
assert.ok(ledger.includes(state.checked_date), 'Market ledger checked date missing');
for (const group of ['E', 'P', 'A', 'D', 'K', 'G', 'R', 'I']) {
  assert.ok(new RegExp(`\\| ${group}1 \\|.*https://`).test(ledger), `Source group ${group} missing`);
}
const blueprint = json('docs/blueprint/model.json');
assert.equal(blueprint.validation_status, state.validation_status);
assert.equal(blueprint.current_new_recurring_infra_usd, 0);
assert.equal(blueprint.stored_practice_history, false);
assert.equal(state.strategy_merge.sha, 'a0e7296d78bec368ef1c22bd022a916c2bf6c754');
assert.equal(state.main_integration, 'STRATEGY_PR23_MERGED_BLUEPRINT_PENDING');
assert.equal(blueprint.screen_ids.length, 9);
assert.equal(new Set(blueprint.screen_ids).size, 9);
assert.equal(blueprint.feature_ids.length, 12);
for (const feature of blueprint.feature_ids) assert.ok(read('docs/blueprint/FEATURES_AND_SCREENS.md').includes(`| ${feature} |`));
const prototype = read('docs/blueprint/prototype/app.js');
for (const screen of blueprint.screen_ids) assert.ok(prototype.includes(`function ${screen}()`), `Missing screen ${screen}`);
for (const option of blueprint.hosting_options) {
  close(option.web + option.vm_backup + option.database_prod_staging + option.smtp_allowance + option.domain_backup_allowance + option.contingency, option.cash_total, `${option.id} cash`);
  close(option.cash_total + option.infra_ops_hours * blueprint.labour_usd_hour, option.cash_plus_infra_labour, `${option.id} labour`);
}
const roi = blueprint.automation_scenario;
const managed = blueprint.hosting_options.find(o => o.id === 'managed');
const benefit = roi.days / 7 * (roi.manual_hours_week - roi.remaining_manual_hours_week) * blueprint.labour_usd_hour;
const recurring = roi.monthly_bills * managed.cash_plus_infra_labour;
close(benefit, roi.benefit_usd, '90day benefit');
close(recurring, roi.incremental_recurring_usd, '90day recurring');
close((benefit - recurring - roi.setup_cash) / blueprint.labour_usd_hour, roi.max_build_hours, 'max build hours');
close(benefit - recurring - roi.setup_cash - roi.build_hours_low * blueprint.labour_usd_hour, roi.net_at_low_build_usd, '90day net');
const designReconciliation = read('docs/blueprint/RED_TEAM.md');
for (const [prefix, count, file] of [['BI', 15, 'INVESTMENT_ATTACK'], ['BO', 18, 'OPERATIONS_ATTACK']]) {
  const raw = read(`docs/blueprint/reviews/${file}.md`);
  for (let n = 1; n <= count; n++) {
    const id = `${prefix}-${String(n).padStart(2, '0')}`;
    assert.ok(raw.includes(id), `Missing raw blueprint finding ${id}`);
    assert.equal((designReconciliation.match(new RegExp(`\\| ${id} \\|`, 'g')) || []).length, 1, `Missing/duplicate blueprint disposition ${id}`);
  }
}
console.log(`Planning integrity passed: ${docs.length} documents, ${localLinks} local links, 8 thesis scores, unit costs/budgets, 42 strategy + 33 blueprint dispositions, 32 risks, hosting/ROI model, 9 screens/12 features.`);
console.log('No market, learning, payment, security-release, or product efficacy claim is validated by this check.');
