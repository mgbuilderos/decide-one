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
 *
 * Six doors, three rooms. P6 cut 1-3-5, MoSCoW and Pareto on the grounds that
 * they duplicate or restate the survivors — so the conditions they answered are
 * routed to the method that actually does the work. More ways in than there are
 * methods is the point: the user describes a day, not a technique.
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
    effect: 'Then decide now what must ship, and what will not.',
    framework: 'eisenhower'
  },
  {
    id: 'mixed_load',
    label: 'A mix of big and small.',
    effect: 'Then today gets three, and the big one goes first.',
    framework: 'rule_of_3'
  },
  {
    id: 'busy_static',
    label: 'Plenty of activity, nothing moving.',
    effect: 'Then three that actually move something. The rest can wait.',
    framework: 'rule_of_3'
  }
];

export function getConditionById(id) {
  return DAY_CONDITIONS.find(c => c.id === id) || null;
}

export function frameworkForCondition(id) {
  return getConditionById(id)?.framework || null;
}
