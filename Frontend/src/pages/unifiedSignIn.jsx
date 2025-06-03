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
import { AdvancedImage } from "@cloudinary/react";
import { getCloudinaryImage, imageCollections } from "../services/imageService";
import { API_BASE_URL } from "../config/apiConfig";

export const UnifiedSignIn = ({ setUserType, setIsAuthenticated }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();
  const microsoftProvider = new OAuthProvider("microsoft.com");

  // Get Google icon
  const googleIcon = getCloudinaryImage(imageCollections.icons.google, {
    width: 32,
    height: 32,
  });

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
      const idToken = await user.getIdToken(); // Get the correct Firebase ID token

      const res = await fetch(`${API_BASE_URL}/api/user/firebaseSignIn`, {
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

        // After successful Firebase sign-in and backend user creation/update
        // Check user type and then verify approval status for providers
        if (selectedUserType === "customer") {
          navigate("/formpage");
        } else if (selectedUserType === "provider") {
          // For providers, check approval status with backend
          try {
            const approvalRes = await fetch(`${API_BASE_URL}/api/user/checkProviderApproval`, { // Replace with your actual backend endpoint
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid: user.uid, email: user.email }), // Send UID and potentially email
            });

            const approvalData = await approvalRes.json();

            if (approvalData.isApproved) { // Assuming your backend sends { isApproved: true/false }
              navigate("/allapplications");
            } else {
              // Provider account is pending approval
              showMessage("Your account is pending admin approval.", "info");
              console.log("Provider account pending approval:", user.uid);
               // Optionally log out the user from Firebase if you don't want them partially signed in
              // auth.signOut();
               // setIsAuthenticated(false);
            }
          } catch (approvalError) {
            console.error("Error checking provider approval status:", approvalError);
            showMessage("Could not verify provider approval status.", "error");
             // Optionally log out the user on error
            // auth.signOut();
             // setIsAuthenticated(false);
          }
        } else {
          // Handle other user types or default navigation
           navigate("/formpage"); // Default to customer page or a general dashboard
        }
      } else {
        showMessage(data.error || "Failed to sign in with Google", "error");
      }
    } catch (error) {
      console.log("Google Sign-In error:", error);
      showMessage("Error during Google Sign-In", "error");
      setIsLoading(false); // Ensure loading state is false on error
    } finally {
      setIsLoading(false);
    }
  };

  const initalizeMicrosoftSignin = async () => {
    if (!selectedUserType) {
      showMessage("Please select your user type first", "error");
      return;
    }

    setIsLoading(true);

    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, microsoftProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

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
        showMessage("Successfully signed in with Outlook!", "success");
        navigate(
          selectedUserType === "customer" ? "/formpage" : "/allapplications"
        );
      } else {
        showMessage(data.error || "Failed to sign in with Outlook", "error");
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
          className="w-full py-3 px-6 bg-white text-gray-800 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-md hover:shadow-lg hover:border-blue-700 hover:scale-[1.02]"
        >
          <AdvancedImage cldImg={googleIcon} className="w-8 h-8" />
          {t("auth.signInWithGoogle")}
        </button>

        {/* Microsoft Sign-In Button */}

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
