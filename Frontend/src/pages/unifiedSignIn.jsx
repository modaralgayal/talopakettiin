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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/60 flex flex-col items-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 drop-shadow">
          {t("Kirjaudu")}
        </h1>
        <p className="text-gray-700/90 mb-8 text-center drop-shadow">
          Valitse käyttäjätyyppisi jatkaaksesi
        </p>
        <div className="flex w-full gap-4 mb-6">
          <button
            onClick={() => handleUserTypeSelection("customer")}
            className={`flex-1 flex flex-col items-center justify-center p-6 bg-white/40 backdrop-blur-md border border-gray-200/40 rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg hover:bg-white/60 focus:outline-none ${
              selectedUserType === "customer" ? "ring-2 ring-blue-500" : ""
            }`}
            type="button"
          >
            <FaUser className="w-8 h-8 mb-2 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">Hakija</span>
            <span className="text-gray-600 text-sm mt-1">
              Etsin sopivaa talopakettia
            </span>
          </button>
          <button
            onClick={() => handleUserTypeSelection("provider")}
            className={`flex-1 flex flex-col items-center justify-center p-6 bg-white/40 backdrop-blur-md border border-gray-200/40 rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg hover:bg-white/60 focus:outline-none ${
              selectedUserType === "provider" ? "ring-2 ring-blue-500" : ""
            }`}
            type="button"
          >
            <FaBuilding className="w-8 h-8 mb-2 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              Toimittaja
            </span>
            <span className="text-gray-600 text-sm mt-1">
              Teen talopakettitarjouksia
            </span>
          </button>
        </div>
        <button
          onClick={initializeGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-6 mt-2 mb-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-blue-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GoogleLogo />
          {isLoading ? "Kirjaudutaan..." : "Kirjaudu Googlella"}
        </button>

        {/*
        <button
          onClick={initalizeMicrosoftSignin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-6 mb-2 rounded-full bg-[#2F2F2F] text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-blue-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <MicrosoftLogo />
          {isLoading ? "Kirjaudutaan..." : "Kirjaudu Microsoftilla"}
        </button>*/}
        {message && (
          <div
            className={`mt-4 w-full text-center rounded-lg py-2 px-4 ${
              messageType === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
