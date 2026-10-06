export function formatDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isoTimestamp(): string {
  return new Date().toISOString();
}
