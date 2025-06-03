import axios from "axios";
import { USER_API_URL } from "../config/apiConfig";

console.log("This is the baseurl", USER_API_URL);

export const testConnection = async () => {
  try {
    const response = await axios.get(`${USER_API_URL}/api/test`);
    console.log("Response is: ", response.data);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

// Logout
export const logOut = async () => {
  try {
    await axios.post(`${USER_API_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Validate token
export const validateToken = async () => {
  try {
    console.log("Checking validity");
    const response = await axios.post(
      `${USER_API_URL}/validate-token`,
      {},
      { withCredentials: true }
    );
    // console.log("This is the response: ", response);
    return {
      isValid: response.status,
      userType: response.data.userType,
    };
  } catch (error) {
    console.log("Token validation failed:", error.message);
    return { isValid: false };
  }
};
