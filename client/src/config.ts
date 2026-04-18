// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to build API URLs
export const apiUrl = (path: string) => `${API_URL}${path}`;
