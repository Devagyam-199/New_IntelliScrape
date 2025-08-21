import axios from "axios";

// Main API instance (with interceptors)
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // Ensures cookies are sent, addressing potential CORS issues
});

// Minimal Axios instance for refresh requests (no interceptor)
const refreshApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;

    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      try {
        const refreshResponse = await refreshApi.post("/auth/refresh");
        if (refreshResponse.status === 200) {
          return api(originalReq);
        } else {
          throw new Error(`Refresh failed with status: ${refreshResponse.status}`);
        }
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

/* ===========================================================================
   Debug Code ( Uncomment and move up for troubleshooting )
   =========================================================================== */
  /*
  api.interceptors.response.use(
    (response) => {
      console.log("Interceptor success:", response.status, response.data); // Logs success for debugging token refresh
      return response;
    },
    async (error) => {
      const originalReq = error.config;
      console.log("Interceptor error:", { status: error.response?.status, data: error.response?.data }); // Captures initial 401 errors

      if (error.response?.status === 401 && !originalReq._retry) {
        originalReq._retry = true;
        console.log("Attempting token refresh for:", originalReq.url); // Indicates refresh attempt

        try {
          const refreshResponse = await refreshApi.post("/auth/refresh");
          console.log("Refresh response:", refreshResponse.status, refreshResponse.data); // Confirms successful refresh

          if (refreshResponse.status === 200) {
            console.log("Refresh successful:", refreshResponse.data); // Confirms successful refresh
            return api(originalReq);
          } else {
            throw new Error(`Refresh failed with status: ${refreshResponse.status}`); // Handles non-200 responses
          }
        } catch (refreshError) {
          console.error("Refresh failed:", {
            status: refreshError.response?.status,
            data: refreshError.response?.data,
          }); // Logs refresh failures, previously triggered by user ID mismatch
          window.location.href = "/login"; // Redirects on failure, resolving user experience issue
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
  */

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