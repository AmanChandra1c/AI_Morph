import * as jwt_decode from "jwt-decode";

// Helper function to check if token is valid
export const isTokenValid = () => {
  const token = localStorage.getItem("token"); // get token from localStorage
  try {
    const decoded = jwt_decode(token); // decode JWT
    const currentTime = Date.now() / 1000; // current time in seconds
    return decoded.exp > currentTime; // true if not expired
  } catch (err) {
    return false; // invalid token format
  }
};
