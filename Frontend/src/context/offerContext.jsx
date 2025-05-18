import React, { createContext, useContext, useState, useEffect } from "react";

// Initial state for offerData
const initialOfferData = {
  userId: "",
  entryId: "", // This will be set when making an offer
  price: "",
  firmName: "",
  description: "",
  providerEmail: "",
  formData: {}, // This is where the formData will be stored
};

// Create the context
const OfferContext = createContext();

// Custom hook to use the OfferContext
export const useOfferContext = () => {
  return useContext(OfferContext);
};

// Provider component to wrap around the app
export const OfferProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [offerData, setOfferData] = useState(() => {
    const savedData = localStorage.getItem('offerData');
    return savedData ? JSON.parse(savedData) : initialOfferData;
  });

  // Save to localStorage whenever offerData changes
  useEffect(() => {
    localStorage.setItem('offerData', JSON.stringify(offerData));
  }, [offerData]);

  const updateOfferData = (data) => {
    setOfferData(data); // Update the offer data
  };

  const resetOfferData = () => {
    setOfferData(initialOfferData); // Reset to initial state
    localStorage.removeItem('offerData'); // Clear from localStorage
  };

  return (
    <OfferContext.Provider value={{ offerData, updateOfferData, resetOfferData }}>
      {children}
    </OfferContext.Provider>
  );
};
