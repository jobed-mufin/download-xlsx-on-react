import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh the user token (replace this with your actual logic)
const refreshToken = async () => {
  // Your token refreshing logic here
  // This function should return a promise that resolves with the new token
  // If the refresh fails, it should reject with an error
};

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    // Check if the user has a valid token
    if (localStorage.getItem("accessToken")) {
      config.headers.Authorization = `Bearer ${localStorage.getItem(
        "accessToken"
      )}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // If the response status is 401 (unauthorized), attempt to refresh the token
    if (response.status === 401) {
      return refreshToken()
        .then((newToken) => {
          // Update the original request header with the new token
          response.config.headers.Authorization = `Bearer ${newToken}`;
          return axios(response.config); // Retry the original request
        })
        .catch((refreshError) => {
          // Handle token refresh error
          console.error("Token refresh failed:", refreshError);
          // Redirect to login page or handle the error as needed
          throw refreshError;
        });
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
