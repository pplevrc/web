export function date(month: number, day: number): Date {
  return new Date(0, month - 1, day);
}
