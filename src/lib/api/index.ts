// Main API exports
export { default as ApiService, authAPI, adminAPI, teamAPI } from './service';
export { apiClient, adminClient, teamClient } from './config';

// Re-export everything from client.ts for backwards compatibility  
export * from './client';