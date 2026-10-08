import type { QueryEntry } from '../../../support/helpers/common/db.helpers.js';

// Example query contract — copy this template for each module
export const EXAMPLE_QUERIES = {
  findUserByEmail: {
    sql: 'SELECT * FROM users WHERE email = :email LIMIT 1',
    params: ['email'],
    mutates: false,
  },
  createUser: {
    sql: 'INSERT INTO users (email, name, role) VALUES (:email, :name, :role)',
    params: ['email', 'name', 'role'],
    mutates: true,
  },
} satisfies Record<string, QueryEntry>;
