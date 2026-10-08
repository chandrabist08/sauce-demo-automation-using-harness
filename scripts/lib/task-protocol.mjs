export const TASK_PROTOCOL_VERSION = '1.0.0';

export function formatTask(id, description, phase) {
  return { id, description, phase, createdAt: new Date().toISOString() };
}
