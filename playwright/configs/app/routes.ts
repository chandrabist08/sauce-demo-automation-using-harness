// Filled after DISCOVER agent runs — do not add routes manually
export const ROUTES = {} as const;

// Filled after DISCOVER agent runs — do not add endpoints manually
export const API_ENDPOINTS = {} as const;

export type Routes = typeof ROUTES;
export type ApiEndpoints = typeof API_ENDPOINTS;
