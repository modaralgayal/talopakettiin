import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/apiConfig";
import { useTranslation } from "react-i18next";
import blackLogo from "../headers/talopakettiinlogovariants-black.png"; // Assuming logo is also accessible here

const Footer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const footerNavigationItems = [
    { name: t("navigation.about"), path: "/about" },
    { name: t("navigation.blog"), path: "/blog" },
    { name: t("navigation.contact"), path: "/contact" },
  ];

  const handleAdminSignIn = async () => {
    setIsLoading(true);
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
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
    <footer className="w-full bg-gray-900 text-white py-16 px-4 md:px-8 shadow-lg z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

        {/* Branding/Copyright Section */}
        <div className="flex flex-col items-start">
          <NavLink to="/" className="flex-shrink-0 mb-4">
            <img
              src={blackLogo}
              alt="Talopakettiin logo"
              className="w-28 h-auto object-contain"
            />
          </NavLink>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} talopakettiin.fi
          </p>
          <p className="text-sm text-gray-400">Suunniteltu Suomessa</p>
        </div>

        {/* Navigation Links Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {footerNavigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <address className="not-italic space-y-2">
            <a href="mailto:admin@talopakettiin.fi" className="text-gray-400 hover:text-blue-400 underline">
              admin@talopakettiin.fi
            </a>
            {/* Placeholder for phone if needed later */}
            <p className="text-gray-400">+358 123 4567 (Placeholder)</p>
            <p className="text-gray-400">
              Your Street Address,
              <br />
              Your City, Your Postal Code
            </p>
          </address>
        </div>

        {/* Admin Section (hidden link inspiration) */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold text-white mb-4">For Admins</h3>
          <button
            onClick={handleAdminSignIn}
            disabled={isLoading}
            className="text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {isLoading ? "Loading..." : "Admin Login"}
          </button>
        </div>

      </div>
  </footer>
);
};

export default Footer; 