// Filled after DISCOVER agent runs — do not add routes manually
export const ROUTES: Record<string, string> = {
    login: "/",
    inventory: "/inventory.html",
};

// Filled after DISCOVER agent runs — do not add endpoints manually
export const API_ENDPOINTS: Record<string, string> = {};

export type Routes = typeof ROUTES;
export type ApiEndpoints = typeof API_ENDPOINTS;
