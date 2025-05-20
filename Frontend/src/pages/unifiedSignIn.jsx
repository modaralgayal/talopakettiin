import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBuilding } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

// Firebase backend API endpoint
const API_BASE_URL = "https://api.talopakettiin.fi";

export const UnifiedSignIn = ({ setUserType, setIsAuthenticated }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUserTypeSelection = (type) => {
    setSelectedUserType(type);
  };

  const initializeGoogleSignIn = async () => {
    if (!selectedUserType) {
      showMessage("Please select your user type first", "error");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken(); // Get the correct Firebase ID token

      const res = await fetch(`${API_BASE_URL}/api/user/firebaseGoogleSignIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: idToken, // Send the correct token
          userType: selectedUserType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUserType(selectedUserType);
        setIsAuthenticated(true);
        showMessage("Successfully signed in with Google!", "success");
        navigate(
          selectedUserType === "customer" ? "/formpage" : "/allapplications"
        );
      } else {
        showMessage(data.error || "Failed to sign in with Google", "error");
      }
    } catch (error) {
      console.log("Google Sign-In error:", error);
      showMessage("Error during Google Sign-In", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {t("common.signIn")}
          </h2>
          <LanguageSwitcher />
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          {t("auth.selectUserType")}
        </p>

        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <button
            type="button"
            onClick={() => handleUserTypeSelection("customer")}
            className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all ${
              selectedUserType === "customer"
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-gray-200 hover:border-blue-300 hover:scale-105"
            }`}
          >
            <FaUser className="w-12 h-12 mb-4 text-blue-500" />
            <span className="text-xl font-semibold">
              {t("auth.customer.title")}
            </span>
            <span className="text-sm text-gray-500 mt-2">
              {t("auth.customer.description")}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleUserTypeSelection("provider")}
            className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all ${
              selectedUserType === "provider"
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-gray-200 hover:border-blue-300 hover:scale-105"
            }`}
          >
            <FaBuilding className="w-12 h-12 mb-4 text-blue-500" />
            <span className="text-xl font-semibold">
              {t("auth.provider.title")}
            </span>
            <span className="text-sm text-gray-500 mt-2">
              {t("auth.provider.description")}
            </span>
          </button>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={initializeGoogleSignIn}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {t("auth.signInWithGoogle")}
        </button>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              messageType === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};
