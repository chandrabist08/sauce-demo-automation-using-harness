export const TEST_USERS = {
  admin: {
    email: process.env.ADMIN_EMAIL ?? '',
    password: process.env.ADMIN_PASSWORD ?? '',
    role: 'admin',
  },
} as const;
