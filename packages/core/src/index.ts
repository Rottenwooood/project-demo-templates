// Core utilities for my-app
// Add your shared utilities here

/**
 * Example utility function
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Example type definition
 */
export interface AppConfig {
  name: string;
  version: string;
  apiUrl: string;
}

/**
 * Get default app configuration
 */
export function getDefaultConfig(): AppConfig {
  return {
    name: "my-app",
    version: "0.0.1",
    apiUrl: "/api/v1",
  };
}
