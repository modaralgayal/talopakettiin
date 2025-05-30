import React, { useEffect, useState } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
// Pages
import { Homepage } from "./pages/homepage";
import { AboutPage } from "./pages/aboutPage";
import { ContactUsPage } from "./pages/contactUsPage";
import { UnifiedSignIn } from "./pages/unifiedSignIn";
import { ApplicationForm } from "./pages/formPage";
import { MyApplications } from "./pages/viewMyApplications";
import { ViewCustomerApplications } from "./pages/viewCustomerApplications";
// Headers
import { Header } from "./headers/Header";
import { ProviderHeader } from "./headers/providerHeader";
import { CustomerHeader } from "./headers/customerHeader";
import MakeOffer from "./pages/makeOffer";
import GetOffers from "./pages/getOffers";
// Auth utils
import { validateToken, logOut } from "./controllers/userController";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/about", "/contact", "/signin", "/formpage"];

function App() {
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("User logged out");
      setUserType(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      navigate("/");
      setUserType(null);
      setIsAuthenticated(false);
      console.error("Logout failed:", error);
    }
  };
  // Tarkistaa joka kerta
  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      try {
        const { isValid, userType } = await validateToken();
        console.log("Validation reponse: ", isValid, userType);
        if (isValid) {
          setUserType(userType);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUserType(null);
          if (
            !publicRoutes.includes(location.pathname) &&
            location.pathname !== "/signin"
          ) {
            navigate("/signin");
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up interval for session check
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [location.pathname]); // Add location.pathname as dependency

  // Protected route wrapper component
  const ProtectedRoute = ({ children }) => {
    // If still loading, don't redirect yet
    if (isLoading) {
      return null; // or a loading spinner component
    }

    // Only redirect if not authenticated and not on a public route
    if (
      !isAuthenticated &&
      !publicRoutes.includes(location.pathname) &&
      location.pathname !== "/signin"
    ) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  // If initial loading, show nothing or a loading spinner
  if (isLoading) {
    return null; // or a loading spinner component
  }

  return (
    <div className="min-h-screen flex flex-col">
      {userType === "customer" ? (
        <CustomerHeader handleLogout={handleLogout} />
      ) : userType === "provider" ? (
        <ProviderHeader handleLogout={handleLogout} />
      ) : (
        <Header handleLogout={handleLogout} />
      )}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Helmet>
                  <title>{`Talopakettiin - ${t("navigation.home")}`}</title>
                  <meta
                    name="description"
                    content={t("navigation.homeDescription")}
                  />
                  <link rel="canonical" href="/" />
                </Helmet>
                <Homepage />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Helmet>
                  <title>{`Talopakettiin - ${t("navigation.about")}`}</title>
                  <meta
                    name="description"
                    content="Tietoa meistä - Talopakettiin"
                    description="Tästä löydät tietoa meidän yrityksestämme"
                  />
                  <link rel="canonical" href="/about" />
                </Helmet>
                <AboutPage />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Helmet>
                  <title>{`Talopakettiin - ${t("navigation.contact")}`}</title>
                  <meta
                    name="description"
                    content="Ota yhteyttä - Talopakettiin"
                  />
                  <link rel="canonical" href="/contact" />
                </Helmet>
                <ContactUsPage />
              </>
            }
          />
          <Route
            path="/signin"
            element={
              <>
                <Helmet>
                  <title>{`Talopakettiin - ${t("navigation.signin")}`}</title>
                  <meta
                    name="description"
                    content="Kirjaudu sisään - Talopakettiin"
                  />
                  <link rel="canonical" href="/signin" />
                </Helmet>
                <UnifiedSignIn
                  setUserType={setUserType}
                  setIsAuthenticated={setIsAuthenticated}
                />
              </>
            }
          />
          <Route
            path="/formpage"
            element={
              <>
                <Helmet>
                  <title>{`Talopakettiin - ${t(
                    "navigation.application"
                  )}`}</title>
                  <meta
                    name="description"
                    content="Täytä hakemus - Talopakettiin"
                  />
                  <link rel="canonical" href="/formpage" />
                </Helmet>
                <ApplicationForm
                  formData={formData}
                  setFormData={setFormData}
                  isAuthenticated={isAuthenticated}
                />
              </>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/viewmyapplications"
            element={
              <ProtectedRoute>
                <>
                  <Helmet>
                    <title>{`Talopakettiin - ${t(
                      "navigation.myApplications"
                    )}`}</title>
                    <meta
                      name="description"
                      content="Omat hakemukset - Talopakettiin"
                    />
                    <link rel="canonical" href="/viewmyapplications" />
                  </Helmet>
                  <MyApplications />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/allapplications"
            element={
              <ProtectedRoute>
                <>
                  <Helmet>
                    <title>{`Talopakettiin - ${t(
                      "navigation.allApplications"
                    )}`}</title>
                    <meta
                      name="description"
                      content="Kaikki hakemukset - Talopakettiin"
                    />
                    <link rel="canonical" href="/allapplications" />
                  </Helmet>
                  <ViewCustomerApplications />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/makeoffer"
            element={
              <ProtectedRoute>
                <>
                  <Helmet>
                    <title>{`Talopakettiin - ${t(
                      "navigation.makeOffer"
                    )}`}</title>
                    <meta
                      name="description"
                      content="Tee tarjous - Talopakettiin"
                    />
                    <link rel="canonical" href="/makeoffer" />
                  </Helmet>
                  <MakeOffer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewmyoffers"
            element={
              <ProtectedRoute>
                <>
                  <Helmet>
                    <title>{`Talopakettiin - ${t(
                      "navigation.myOffers"
                    )}`}</title>
                    <meta
                      name="description"
                      content="Katso tarjoukset - Talopakettiin"
                    />
                    <link rel="canonical" href="/viewmyoffers" />
                  </Helmet>
                  <GetOffers />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
