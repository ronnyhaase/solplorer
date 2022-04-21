export function calculateChange(oldVal: number, newVal: number): number {
  if (newVal === oldVal || oldVal === 0) return 0;
  else return -(((oldVal - newVal) / oldVal) * 100);
}
