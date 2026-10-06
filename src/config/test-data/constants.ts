export const TIMEOUTS = {
  short: 5_000,
  medium: 15_000,
  long: 30_000,
} as const;

export const ROLES = {
  admin: 'admin',
  viewer: 'viewer',
  editor: 'editor',
} as const;
