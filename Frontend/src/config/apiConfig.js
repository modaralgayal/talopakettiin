const getApiBaseUrl = () => {
  return "https://api.talopakettiin.fi";
  //return "http://localhost:8000";
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;
export const FORMS_API_URL = `${API_URL}/forms`;
export const USER_API_URL = `${API_URL}/user`;
