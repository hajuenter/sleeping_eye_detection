export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// API Endpoints
export const API_ENDPOINTS = {
  DETECT: "/api/detect",
  SUMMARY: "/api/summary",
  ANALYSIS_LINE: "/api/analysis/line",
  ANALYSIS_PIE: "/api/analysis/pie",
};

// Axios default configuration
export const axiosConfig = {
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function to build API URL
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, API_BASE_URL);

  // Add query parameters
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });

  return url.toString();
};
