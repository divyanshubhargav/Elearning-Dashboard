//* Packages Imports */
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://localhost:7133/api/auth";

//* Register user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error(`Error during registration: ${error}`);
    throw error;
  }
};

//* Login user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);

    if (response.data?.token) {
      Cookies.set("token", response.data.token, { expires: 1, path: "/" });
      Cookies.set("userId", response.data.userId, { expires: 1, path: "/" });
    }

    return response.data;
  } catch (error) {
    console.error(`Error during login: ${error}`);
    throw error;
  }
};

//* Logout user
export const logoutUser = () => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("userId", { path: "/" });
};
