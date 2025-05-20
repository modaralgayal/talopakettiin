import axios from "axios";

const BASE_URL = "https://api.talopakettiin.fi/api/user";

console.log("This is the baseurl", BASE_URL);

export const testConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/test`);
    console.log("Response is: ", response.data);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

// Logout
export const logOut = async () => {
  try {
    await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Validate token
export const validateToken = async () => {
  try {
    console.log("Checking validity");
    const response = await axios.post(
      `${BASE_URL}/validate-token`,
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
