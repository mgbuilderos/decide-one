export function stepDate(current, delta, directTarget = null) {
  const next = new Date(directTarget || current);
  if (!directTarget) next.setDate(next.getDate() + delta);
  return next;
}
export function shouldOfferClosure({ turningToVerso, hasSomethingToClose, alreadyClosedToday, somethingRunning, dateKey, todayKey }) {
  return turningToVerso && hasSomethingToClose && !alreadyClosedToday && !somethingRunning && dateKey === todayKey;
}
