/**
 * Decide One — Day Conditions
 *
 * The morning entry surface. The user names what TODAY looks like; the
 * instrument silently routes to the method suited to that condition.
 *
 * Two rules govern this file:
 *
 *  1. These name conditions of the DAY, never defects in the person.
 *     "There is too much on today" — not "I am overwhelmed."
 *     A day can be overloaded without the person being at fault. This is the
 *     whole difference in register between a coaching brand and an instrument.
 *
 *  2. No method is ever named here. The user should not need to learn that
 *     Eisenhower exists until after it has helped them.
 *
 * `effect` describes what the instrument will do, in plain mechanism terms.
 */

export const DAY_CONDITIONS = [
  {
    id: 'overloaded',
    label: 'There is too much on today.',
    effect: 'Then today gets three. Nothing else.',
    framework: 'rule_of_3'
  },
  {
    id: 'all_urgent',
    label: 'Everything looks urgent.',
    effect: 'Then separate what is urgent from what actually matters.',
    framework: 'eisenhower'
  },
  {
    id: 'carryover',
    label: "Yesterday's work is still open.",
    effect: 'Then finish in order. One at a time, nothing started early.',
    framework: 'ivy_lee'
  },
  {
    id: 'deadline',
    label: 'A deadline, and not enough room.',
    effect: 'Then decide now what must ship and what will not.',
    framework: 'moscow'
  },
  {
    id: 'mixed_load',
    label: 'A mix of big and small.',
    effect: 'Then one big thing, three medium, five small.',
    framework: 'one_three_five'
  },
  {
    id: 'busy_static',
    label: 'Plenty of activity, nothing moving.',
    effect: 'Then find the few that carry the rest.',
    framework: 'pareto'
  }
];

export function getConditionById(id) {
  return DAY_CONDITIONS.find(c => c.id === id) || null;
}

export function frameworkForCondition(id) {
  return getConditionById(id)?.framework || null;
}
