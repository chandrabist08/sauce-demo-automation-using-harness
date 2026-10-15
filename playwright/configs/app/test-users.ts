export const TEST_USERS = {
  standard: { username: 'standard_user', pass: 'secret_sauce' },
  locked: { username: 'locked_out_user', pass: 'secret_sauce' },
  problem: { username: 'problem_user', pass: 'secret_sauce' },
  glitch: { username: 'performance_glitch_user', pass: 'secret_sauce' },
  error: { username: 'error_user', pass: 'secret_sauce' },
  visual: { username: 'visual_user', pass: 'secret_sauce' },
} as const;

export type TestUserKey = keyof typeof TEST_USERS;
