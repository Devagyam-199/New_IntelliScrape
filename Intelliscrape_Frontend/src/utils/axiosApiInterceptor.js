import axios from "axios";

const api = axios.create({
  baseURL: "https://new-intelliscrape.onrender.com/api/v1",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "https://new-intelliscrape.onrender.com/api/v1",
  withCredentials: true,
});

// Request interceptor to flag endpoints that skip refresh
api.interceptors.request.use((config) => {
  if (config.url === "/auth/logout") {
    config.noRefresh = true;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;

    // Log for debugging
    // if (process.env.NODE_ENV !== "production") {
    //   console.log("Interceptor error:", {
    //     status: error.response?.status,
    //     message: error.response?.data?.message,
    //     url: originalReq.url,
    //     noRefresh: originalReq.noRefresh,
    //     retry: originalReq._retry,
    //   });
    // }

    // Handle 401 errors, but skip for flagged endpoints
    if (
      error.response?.status === 401 &&
      !originalReq._retry &&
      !originalReq.noRefresh
    ) {
      originalReq._retry = true;

      try {
        const refreshResponse = await refreshApi.post("/auth/refresh");
        console.log("Refresh response:", refreshResponse.data);
        if (refreshResponse.status === 200) {
          return api(originalReq); // Retry the original request
        } else {
          throw new Error(
            `Refresh failed with status: ${refreshResponse.status}`
          );
        }
      } catch (refreshError) {
        console.error("Refresh error:", refreshError);
        // Redirect only if not already on login page
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

/* ===========================================================================
   Challenges Faced and Resolutions
   =========================================================================== 
   - Challenge: Interceptor triggered catch block prematurely due to backend 401 errors.
     - Resolution: Enhanced interceptor to check refresh response status and redirect on failure, ensuring proper handling.
   - Challenge: Initial token refresh failures due to user ID mismatch between frontend and backend.
     - Resolution: Aligned token payload with middleware expectations, fixed by login controller update.
   - Challenge: Lack of visibility into refresh process.
     - Resolution: Added debug logs (now commented) to trace the flow, aiding in identifying the root cause.
   =========================================================================== */
