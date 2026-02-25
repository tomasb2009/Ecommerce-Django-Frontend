import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useAuthStore } from "../store/auth";

const apiInstante = axios.create({
  baseURL: "https://ecommerce-django-backend-w2mh.onrender.com/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper function to check if token is expired
const isAccessTokenExpired = (accessToken) => {
  try {
    const decodedToken = jwt_decode(accessToken);
    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

// Helper function to refresh token
const refreshToken = async () => {
  const refresh_token = Cookies.get("refresh_token");
  if (!refresh_token) return null;

  try {
    const response = await axios.post("https://ecommerce-django-backend-w2mh.onrender.com/api/v1/user/token/refresh", {
      refresh: refresh_token,
    });
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Request interceptor to add auth token
apiInstante.interceptors.request.use(
  async (config) => {
    const access_token = Cookies.get("access_token");
    
    if (access_token) {
      // Check if token is expired and refresh if needed
      if (isAccessTokenExpired(access_token)) {
        try {
          const response = await refreshToken();
          if (response) {
            Cookies.set("access_token", response.access, { expires: 1, secure: true });
            Cookies.set("refresh_token", response.refresh, { expires: 7, secure: true });
            const user = jwt_decode(response.access);
            if (user) {
              useAuthStore.getState().setUser(user);
            }
            config.headers.Authorization = `Bearer ${response.access}`;
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      } else {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiInstante.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await refreshToken();
        if (response) {
          Cookies.set("access_token", response.access, { expires: 1, secure: true });
          Cookies.set("refresh_token", response.refresh, { expires: 7, secure: true });
          const user = jwt_decode(response.access);
          if (user) {
            useAuthStore.getState().setUser(user);
          }
          originalRequest.headers.Authorization = `Bearer ${response.access}`;
          return apiInstante(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // Clear auth and redirect to login if refresh fails
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        useAuthStore.getState().setUser(null);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    // Handle 500 errors - log but don't block
    if (error.response?.status === 500) {
      console.error("Server error (500):", error.response.data);
    }

    // Handle 404 errors
    if (error.response?.status === 404) {
      console.warn("Resource not found (404):", error.config.url);
    }

    return Promise.reject(error);
  }
);

export default apiInstante;
