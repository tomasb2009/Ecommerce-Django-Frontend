import Cookie from "js-cookie";
import jwtDecode from "jwt-decode";

function UserData() {
  const accessToken = Cookie.get("access_token");
  const refreshToken = Cookie.get("refresh_token");

  // Si no hay tokens, simplemente devolvemos null sin spamear la consola
  if (!accessToken || !refreshToken) {
    return null;
  }

  try {
    // Usamos el refresh token (como en el curso original) para obtener user_id, vendor_id, etc.
    const decoded = jwtDecode(refreshToken);
    return decoded || null;
  } catch (error) {
    console.error("Failed to decode user token:", error);
    return null;
  }
}

export default UserData;
