import axios from "axios";

const API_URL = "https://talopakettiin.fi/api/forms";


// Send Form Data
export const sendFormData = async (formData) => {
  try {
    // Get the token from wherever you store it after Google sign-in

    const response = await axios.post(
      `${API_URL}/receive-form-data`,
      formData,
      { withCredentials: true }
    );

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        currentCount: response.data.currentCount,
        limit: response.data.limit,
      };
    } else {
      throw new Error(response.data.message || "Failed to submit form");
    }
  } catch (error) {
    if (error.response?.status === 401) {
      throw {
        error: "Authentication Error",
        message:
          "Sinun täytyy kirjautua sisään lähettääksesi hakemuksen. Kirjaudu sisään ja yritä uudelleen.",
      };
    }
    if (error.response?.data?.error === "Application limit reached") {
      throw {
        error: "Application limit reached",
        message: error.response.data.message,
        currentCount: error.response.data.currentCount,
        limit: error.response.data.limit,
      };
    }
    throw error;
  }
};

// Get User Forms
export const getUserForms = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-user-forms`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete User Entry
export const deleteUserEntry = async (entryId) => {
  try {
    const response = await axios.post(
      `${API_URL}/delete-user-entry`,
      { entryId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get All Entries
export const getAllEntries = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-entries`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get User Offers
export const getUserOffers = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-user-offers`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Accept Given Offer
export const acceptOffer = async (id, entryId, emailAddress) => {
  try {
    const response = await axios.put(
      `${API_URL}/accept-given-offer`,
      { id, entryId, emailAddress },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Make Offer to User with PDF support
export const makeOfferToUser = async (
  offerData,
  customerEmail,
  entryId,
  pdfFile
) => {
  try {
    const formData = new FormData();
    formData.append("customerEmail", customerEmail);
    formData.append("entryId", entryId);
    formData.append("pdfFile", pdfFile);
    formData.append("offerData", JSON.stringify(offerData));

    const response = await axios.post(`${API_URL}/make-offer`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOffersForUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-user-offers`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error.response?.data || error.message;
  }
};

export const getOffersForProvider = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-provider-offers`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error.response?.data || error?.message;
  }
};

export const editApplication = async (id, formData) => {
  try {
    console.log(
      `Sending id: ${id}, formData: ${JSON.stringify(formData, null, 2)}`
    );

    const response = await axios.put(
      `${API_URL}/edit-application`,
      {
        id,
        formData,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
