export interface QueryEntry {
  sql: string;
  params: string[];
  mutates: boolean;
}

export interface BoundQuery {
  sql: string;
  values: unknown[];
}

export interface DbHelpers {
  query<T = Record<string, unknown>>(entry: QueryEntry, args: Record<string, unknown>): Promise<T[]>;
  row<T = Record<string, unknown>>(entry: QueryEntry, args: Record<string, unknown>): Promise<T>;
  count(entry: QueryEntry, args: Record<string, unknown>): Promise<number>;
}

function bindQuery(entry: QueryEntry, args: Record<string, unknown>): BoundQuery {
  const unbound = entry.params.filter((p) => !(p in args));
  if (unbound.length > 0) {
    throw new Error(`Unbound query parameters: ${unbound.join(', ')}`);
  }
  let sql = entry.sql;
  const values: unknown[] = [];
  for (const param of entry.params) {
    sql = sql.replace(`:${param}`, `$${values.length + 1}`);
    values.push(args[param]);
  }
  return { sql, values };
}

export function createDbHelpers(
  executeQuery: (sql: string, values: unknown[]) => Promise<Record<string, unknown>[]>,
): DbHelpers {
  return {
    async query<T>(entry, args) {
      const { sql, values } = bindQuery(entry, args);
      return executeQuery(sql, values) as Promise<T[]>;
    },

    async row<T>(entry, args) {
      const { sql, values } = bindQuery(entry, args);
      const rows = await executeQuery(sql, values);
      if (rows.length === 0) throw new Error('row() expected exactly one row, got 0');
      if (rows.length > 1) throw new Error(`row() expected exactly one row, got ${rows.length}`);
      return rows[0] as T;
    },

    async count(entry, args) {
      const { sql, values } = bindQuery(entry, args);
      const rows = await executeQuery(sql, values);
      const raw = Object.values(rows[0] ?? {})[0];
      return Number(raw ?? 0);
    },
  };
}
