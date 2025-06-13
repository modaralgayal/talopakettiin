import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBuilding } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  getAuth,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/apiConfig";

// Google Logo SVG Component
const GoogleLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    className="w-8 h-8"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

// Microsoft Logo SVG Component
const MicrosoftLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 23 23"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
  >
    <path fill="#f25022" d="M1 1h10v10H1z" />
    <path fill="#00a4ef" d="M1 12h10v10H1z" />
    <path fill="#7fba00" d="M12 1h10v10H12z" />
    <path fill="#ffb900" d="M12 12h10v10H12z" />
  </svg>
);

export const UnifiedSignIn = ({ setUserType, setIsAuthenticated }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

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
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // If user is a provider, verify their email first
      if (selectedUserType === "provider") {
        const verifyRes = await fetch(
          `${API_BASE_URL}/api/user/check-provider`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: user.email,
            }),
          }
        );

        const verifyData = await verifyRes.json();
        console.log("This is the check-provider response:", verifyData);
        if (!verifyData.success) {
          showMessage(
            verifyData.error ||
              "This email is not from a verified provider domain",
            "error"
          );
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(`${API_BASE_URL}/api/user/firebaseSignIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: idToken,
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

  // Microsoft signin Functionality
  const initalizeMicrosoftSignin = async () => {
    if (!selectedUserType) {
      showMessage("Please select your user type first", "error");
      return;
    }

    setIsLoading(true);

    try {
      const microsoftProvider = new OAuthProvider("microsoft.com");
      microsoftProvider.setCustomParameters({
        prompt: "consent",
      });
      const auth = getAuth();
      const result = await signInWithPopup(auth, microsoftProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // If user is a provider, verify their email first
      if (selectedUserType === "provider") {
        const verifyRes = await fetch(
          `${API_BASE_URL}/api/user/check-provider`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: user.email,
            }),
          }
        );

        const verifyData = await verifyRes.json();
        console.log("This is the check-provider response:", verifyData);
        if (!verifyData.success) {
          showMessage(
            verifyData.error ||
              "This email is not from a verified provider domain",
            "error"
          );
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(`${API_BASE_URL}/api/user/firebaseSignIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: idToken,
          userType: selectedUserType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUserType(selectedUserType);
        setIsAuthenticated(true);
        showMessage("Successfully signed in with Microsoft!", "success");
        navigate(
          selectedUserType === "customer" ? "/formpage" : "/allapplications"
        );
      } else {
        showMessage(data.error || "Failed to sign in with Microsoft", "error");
      }
    } catch (error) {
      console.log("Microsoft Sign-In error:", error);
      showMessage("Error during Microsoft Sign-In", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b 
        from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
    >
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
          className="w-full py-3 px-6 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-sm hover:shadow-md hover:scale-[1.02]"
        >
          <GoogleLogo />
          {t("auth.signInWithGoogle")}
        </button>

        {/* Microsoft Sign-In Button */}
        <button
          onClick={initalizeMicrosoftSignin}
          className="w-full py-3 px-6 bg-[#2F2F2F] text-white border-2 border-[#2F2F2F] rounded-lg hover:bg-[#1F1F1F] transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-md hover:shadow-lg hover:scale-[1.02]"
        >
          <MicrosoftLogo />
          {t("auth.signInWithMicrosoft")}
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
          <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};
