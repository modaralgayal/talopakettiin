import axios from "axios";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE_URL_DEV
    : "https://api.talopakettiin.fi/api/user";

console.log("This is the baseurl", API_BASE_URL);

export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/test`);
    console.log("Response is: ", response.data);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

// Logout
export const logOut = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Validate token
export const validateToken = async () => {
  try {
    console.log("Checking validity");
    const response = await axios.post(
      `${API_BASE_URL}/validate-token`,
      {},
      { withCredentials: true }
    );
    console.log("This is the response: ", response);
    return {
      isValid: response.status,
      userType: response.data.userType,
    };
  } catch (error) {
    console.log("Token validation failed:", error.message);
    return { isValid: false };
  }
};
