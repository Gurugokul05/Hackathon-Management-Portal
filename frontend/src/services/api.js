import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout for slow connections
});

// Request cache for GET requests
const requestCache = new Map();
const CACHE_DURATION = 60000; // 1 minute

// Interceptor to add token and implement caching
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Cache GET requests
    if (config.method === "get") {
      const cacheKey = config.url + JSON.stringify(config.params);
      const cached = requestCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Return cached response
        config.adapter = () => {
          return Promise.resolve({
            data: cached.data,
            status: 200,
            statusText: "OK (cached)",
            headers: {},
            config,
          });
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for caching and error handling
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === "get") {
      const cacheKey =
        response.config.url + JSON.stringify(response.config.params);
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      // Clean up old cache entries periodically
      if (requestCache.size > 100) {
        const entries = Array.from(requestCache.entries());
        entries.slice(0, 50).forEach(([key]) => requestCache.delete(key));
      }
    }
    return response;
  },
  (error) => {
    // Retry logic for network errors
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      console.warn("Request timeout, consider checking your connection");
    }
    return Promise.reject(error);
  },
);

// Clear cached requests
export const clearApiCache = () => {
  requestCache.clear();
};

export default api;
