import React, { useState, useEffect } from "react";
import { PerustiedotForm } from "./hakemusTiedot/perusTiedot";
import { UlkopuoliForm } from "./hakemusTiedot/ulkoPuoliForm";
import { SisapuoliForm } from "./hakemusTiedot/sisäPuoliForm";
import { LämmitysForm } from "./hakemusTiedot/lämmitysForm";
import { TalotekniikkaForm } from "./hakemusTiedot/talotekniikkaForm";
import { OmatTiedotForm } from "./hakemusTiedot/omatTiedotForm";
import { KitchenForm } from "./hakemusTiedot/keittioForm";
import { useFormContext } from "../context/formContext";
import { sendFormData, editApplication } from "../controllers/formController";
import { FaExclamationTriangle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/apiConfig";

export const ApplicationForm = (prop) => {
  const {
    formData,
    setFormData,
    resetForm,
    currentStep,
    editId,
    setCurrentStep,
    validationErrors,
    validateStep,
    setIsAuthenticated,
  } = useFormContext();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [applicationCount, setApplicationCount] = useState(null);
  const [applicationLimit, setApplicationLimit] = useState(10);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const steps = [
    { number: 1, title: t("form.steps.basicInfo") },
    { number: 2, title: t("form.steps.exterior") },
    { number: 3, title: t("form.steps.interior") },
    { number: 4, title: t("form.steps.kitchen") },

    { number: 5, title: t("form.steps.heating") },
    { number: 6, title: t("form.steps.technical") },
    { number: 7, title: t("form.steps.personalInfo") },
  ];

  let isAuthenticated = prop.isAuthenticated;
  //console.log(isAuthenticated);

  const nextStep = () => {
    console.log(currentStep, "AND", steps.length);
    if (currentStep < steps.length) {
      console.log(validateStep(currentStep));
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (stepNumber) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const handleGuestSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }
    try {
      // 1. Sign in with Firebase Google popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // 2. Send the ID token to your backend to create a session
      const res = await fetch(`${API_BASE_URL}/api/user/firebaseGoogleSignIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: idToken,
          userType: "customer",
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Set isAuthenticated to true to prevent logic loop
        if (typeof setIsAuthenticated === "function") {
          setIsAuthenticated(true);
        }
        // 3. Now the user is authenticated, you can submit the form
        await handleSubmit({ preventDefault: () => {} });
      } else {
        setError(data.error || "Failed to sign in with Google");
      }
    } catch (error) {
      setError("Error during Google Sign-In. Please try again.");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!validateStep(currentStep)) {
      return;
    }

    const id = editId;
    try {
      if (id) {
        await editApplication(id, formData);
      } else {
        await sendFormData(formData);
      }
      setSuccess(true);
      setShowSuccessPopup(true);
      resetForm();
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/viewmyapplications");
      }, 2000);
    } catch (err) {
      setError(err.message || "Error submitting application");
    }
  };

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gray-50 pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Rakennushakemus
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Täytä kaikki vaaditut tiedot vaiheittain
          </p>
          {applicationCount !== null && (
            <div className="mt-4 text-sm text-gray-600">
              Hakemuksia: {applicationCount} / {applicationLimit}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}

        <div className="relative mb-8 sm:mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div className="flex justify-between flex-wrap gap-x-2 sm:gap-x-0">
            {steps.map(({ number, title }) => (
              <div
                key={number}
                className="flex flex-col items-center cursor-pointer mb-2 sm:mb-0"
                onClick={() => goToStep(number)}
              >
                <div
                  className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2 transition-colors ${
                    currentStep >= number
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  <span className="font-medium text-sm sm:text-base">{number}</span>
                </div>
                <span
                  className={`mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center ${
                    currentStep >= number ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-4 sm:p-8">
            {currentStep === 1 && (
              <PerustiedotForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 2 && (
              <UlkopuoliForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 3 && (
              <SisapuoliForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 4 && (
              <KitchenForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 5 && (
              <LämmitysForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 6 && (
              <TalotekniikkaForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 7 && (
              <OmatTiedotForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
          </div>

          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
                  }`}
                >
                  {t("navigation.previous")}
                </button>
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors bg-white text-red-600 hover:bg-red-50 border border-red-300 shadow-sm"
                >
                  {t("navigation.startAgain")}
                </button>
              </div>

              {currentStep === steps.length ? (
                <button
                  onClick={async (e) => {
                    if (validateStep(currentStep)) {
                      if (isAuthenticated) {
                        await handleSubmit(e);
                      } else {
                        await handleGuestSubmit();
                      }
                    }
                  }}
                  disabled={applicationCount === applicationLimit}
                  className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors ${
                    applicationCount === applicationLimit
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 shadow-md"
                  }`}
                >
                  Lähetä hakemus
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                >
                  {t("navigation.next")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              Hakemus lähetetty!
            </h2>
            <p className="text-gray-700">
              Sinut ohjataan omiin hakemuksiin hetken kuluttua...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
