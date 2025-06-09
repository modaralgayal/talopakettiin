import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import blackLogo from "./talopakettiinlogovariants-black.png";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/languageContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/apiConfig";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isHome = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigationItems = [
    { name: t("navigation.home"), path: "/" },
    { name: t("navigation.about"), path: "/about" },
    { name: t("navigation.contact"), path: "/contact" },
    { name: t("navigation.blog"), path: "/blog" },
  ];

  const handleAdminSignIn = async () => {
    setIsLoading(true);
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      console.log("This is the user: ", user.email);
      const idToken = await user.getIdToken();

      // Check if user is admin
      const checkRes = await fetch(`${API_BASE_URL}/api/user/check-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: idToken,
          userType: "admin",
          email: user.email,
        }),
      });

      const checkData = await checkRes.json();
      if (checkData.success && checkData.isAdmin) {
        // Sign in as admin
        const res = await fetch(`${API_BASE_URL}/api/user/firebaseSignIn`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            token: idToken,
            userType: "admin",
          }),
        });

        const data = await res.json();
        if (data.success) {
          navigate("/admin");
        }
      } else {
        alert("You are not authorized as an admin.");
      }
    } catch (error) {
      console.error("Admin Sign-In error:", error);
      alert("Error during admin sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header
      className={
        isHome
          ? "bg-white/40 backdrop-blur-lg shadow-lg border border-white/30 transition-colors duration-300 w-full z-20 fixed"
          : "bg-white/40 backdrop-blur-lg shadow-lg border border-white/30 transition-colors duration-300 w-full z-20 fixed"
      }
    >
      <nav className="w-full px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and main navigation */}
          <div className="flex items-center space-x-4 md:space-x-12">
            {/* Logo */}
            <NavLink to="/" className="flex-shrink-0">
              <img
                src={blackLogo}
                alt={t("common.logoAlt")}
                className="w-24 md:w-32 h-auto object-contain hover:opacity-80 transition-opacity"
              />
            </NavLink>

            {/* Main Navigation - Desktop */}
            <ul className="hidden md:flex md:flex-wrap lg:flex-nowrap gap-x-4 gap-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors relative hover:bg-white/20 px-3 py-2 rounded-md ${
                        isActive
                          ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                          : ""
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Language Switcher and Buttons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <LanguageSwitcher />
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `hidden md:inline-block text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors relative hover:bg-white/20 px-3 py-2 rounded-md ${
                  isActive
                    ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                    : ""
                }`
              }
            >
              {t("common.signIn")}
            </NavLink>
            <NavLink
              to="/formpage"
              className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {t("navigation.fillApplication")}
            </NavLink>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-white/20"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
            <button
              onClick={() => {
                handleAdminSignIn();
                setIsMobileMenuOpen(false);
              }}
              disabled={isLoading}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Admin"}
            </button>
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-white/20"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("common.signIn")}
            </NavLink>
            <NavLink
              to="/formpage"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("navigation.fillApplication")}
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};
