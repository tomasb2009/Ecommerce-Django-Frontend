import { useAuthStore } from "../store/auth";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

export const login = async (email, password) => {
  try {
    const { data, status } = await axios.post("http://127.0.0.1:8000/api/v1/user/token/", {
      email,
      password,
    });

    if (status === 200) {
      setAuthUser(data.access, data.refresh);

      Toast.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
      });
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response.data?.detail || "Algo salió mal",
    };
  }
};

export const register = async (
  full_name,
  email,
  phone,
  password,
  password2,
) => {
  try {
    const { data } = await axios.post("http://127.0.0.1:8000/api/v1/user/register/", {
      full_name,
      email,
      phone,
      password,
      password2,
    });

    await login(email, password);

    Toast.fire({
      icon: "success",
      title: "Cuenta creada correctamente",
    });

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response.data?.detail || "Algo salió mal",
    };
  }
};

export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  useAuthStore.getState().setUser(null);
  // Clear cart ID so the next session gets a fresh cart (no other user's cart)
  localStorage.removeItem("randomString");
};

export const setUser = async () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return;
  }

  try {
    if (isAccessTokenExpired(accessToken)) {
      const response = await getRefreshToken();

      // Si no se pudo refrescar (401 o token inválido), salimos
      if (!response) {
        return;
      }

      setAuthUser(response.access, response.refresh);
    } else {
      setAuthUser(accessToken, refreshToken);
    }
  } catch (error) {
    console.error("Error in setUser:", error);
    logout();
  }
};

export const setAuthUser = (access_token, refresh_token) => {
  Cookies.set("access_token", access_token, {
    expires: 1,
    secure: true,
  });
  Cookies.set("refresh_token", refresh_token, {
    expires: 7,
    secure: true,
  });

  const user = jwt_decode(access_token) ?? null;

  if (user) {
    useAuthStore.getState().setUser(user);
  }
  useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
  const refresh_token = Cookies.get("refresh_token");

  if (!refresh_token) {
    return null;
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/v1/user/token/refresh", {
      refresh: refresh_token,
    });
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Si el refresh falla (p.ej. 401), cerramos sesión en el frontend
    logout();
    return null;
  }
};

export const isAccessTokenExpired = (accessToken) => {
  try {
    const decodedToken = jwt_decode(accessToken);
    // exp viene en segundos; Date.now() está en milisegundos
    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    console.log(error);
    return true;
  }
};
