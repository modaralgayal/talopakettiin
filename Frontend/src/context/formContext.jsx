import React, { createContext, useState, useContext, useEffect } from "react";
import { useLanguage } from "./languageContext";
import { useTranslation } from "react-i18next";

const createDefaultForm = () => {
  const defaultFormData = {
    // Basic Info
    applicationName: "",
    city: "",
    province: "",
    budget: "",
    houseSize: "",
    houseType: "", // Uusi
    delivery: "", // Uusi
    stories: "", // Uusi, how many stories (1, 2 or 3)
    bedrooms: "",
    utilityRoom: "",
    utilityRoomDetails: "",
    mudroom: "",
    mudroomDetails: "",
    terrace: "",
    terraceDetails: "",
    carport: "",
    carportDetails: "",
    garage: "",
    garageDetails: "",

    // Exterior
    houseMaterial: "",
    houseMaterialOther: "",
    roof: "", // New options
    roofType: "",
    roofOther: "",
    houseShape: "", // Uusi
    houseStyle: "", // Uusi

    // Interior
    floor: "",
    floorDetails: "",
    interiorWalls: "",
    interiorWallsDetails: "",
    ceiling: "",
    ceilingDetails: "",

    // Kitchen : Add this new step, gets its own page
    kitchenType: "",
    kitchenAccessories: "",

    // Heating'
    heatingType: "", // Uusi
    heatingTypeOther: "", // Uusi
    heatingMethod: [], // I split heating type to heating method and heating type
    heatingMethodOther: "", // Uusi
    directElectricHeating: "",
    fireplace: "",
    fireplaceHeatStorage: "",
    bakingOven: "",
    bakingOvenDetails: "",
    otherInfoIndoor: "",

    // Technical
    interestedIn: [],
    interestedInOther: "",
    wantsInOffer: [],
    wantsInOfferOther: "",

    // Personal Info
    customerStatus: "",
    hasPlot: "",
    fullName: "",
    phoneNumber: "",
    additionalInfo: "",
    privacyPolicy: false,
    attachments: [], // Optional attachments
  };

  return defaultFormData;
};

// Create context
const FormContext = createContext({
  formData: createDefaultForm(),
  setFormData: () => {},
  resetForm: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  validationErrors: {},
  setValidationErrors: () => {},
  validateStep: () => {},
});

export const FormProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  // console.log("Current language is: ", currentLanguage);
  // console.log("testing t", t("form.options.fieldRequired"));
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : createDefaultForm();
  });

  // Initialize current step from localStorage
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("formStep");
    return savedStep ? parseInt(savedStep) : 1;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [editId, setEditId] = useState(null);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // Save to localStorage whenever step changes
  useEffect(() => {
    localStorage.setItem("formStep", currentStep.toString());
  }, [currentStep]);

  // Function to validate the current step
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1: // Perustiedot
        if (!formData.city) errors.city = t("form.options.fieldRequired");
        if (!formData.province)
          errors.province = t("form.options.fieldRequired");
        if (!formData.bedrooms)
          errors.bedrooms = t("form.options.fieldRequired");
        if (!formData.houseType)
          errors.houseType = t("form.options.fieldRequired");
        if (!formData.utilityRoom)
          errors.utilityRoom = t("form.options.fieldRequired");
        if (!formData.mudroom) errors.mudroom = t("form.options.fieldRequired");
        if (!formData.terrace) errors.terrace = t("form.options.fieldRequired");
        if (!formData.carport) errors.carport = t("form.options.fieldRequired");
        if (!formData.garage) errors.garage = t("form.options.fieldRequired");
        if (!formData.delivery)
          errors.delivery = t("form.options.fieldRequired");
        // Budget and house size required
        if (!formData.budget || formData.budget.trim() === "") {
          errors.budget = t("form.options.fieldRequired");
        }
        if (!formData.houseSize || formData.houseSize.trim() === "") {
          errors.houseSize = t("form.options.fieldRequired");
        }
        if (!formData.stories) errors.stories = t("form.options.fieldRequired");
        if (!formData.applicationName)
          errors.applicationName = t("form.options.fieldRequired");
        break;
      case 2: // Ulkopuoli
        if (!formData.houseMaterial)
          errors.houseMaterial = t("form.options.fieldRequired");
        if (!formData.roof) errors.roof = t("form.options.fieldRequired");
        if (!formData.houseShape)
          errors.houseShape = t("form.options.fieldRequired");
        if (!formData.houseStyle)
          errors.houseStyle = t("form.options.fieldRequired");
        if (!formData.roofType)
          errors.roofType = t("form.options.fieldRequired");

        break;
      case 3: // Sisäpuoli
        if (!formData.floor) errors.floor = t("form.options.fieldRequired");
        if (!formData.interiorWalls)
          errors.interiorWalls = t("form.options.fieldRequired");
        if (!formData.ceiling) errors.ceiling = t("form.options.fieldRequired");
        break;
      case 4:
        if (!formData.kitchenType) {
          console.log("Error in type");
          errors.kitchenType = t("form.options.fieldRequired");
        }
        break;

      case 5: // Lämmitys
        if (!formData.heatingType || formData.heatingType.length === 0) {
          errors.heatingType = "Valitse vähintään yksi";
        }

        if (!formData.heatingMethod || formData.heatingMethod.length === 0) {
          errors.heatingMethod = "Valitse vähintään yksi";
        }

        break;
      case 6: // Talotekniikka
        if (!formData.interestedIn || formData.interestedIn.length === 0) {
          errors.interestedIn = t("form.options.chooseOneAtLeast");
        }
       
        break;
      case 7: // Omat Tiedot
        if (!formData.customerStatus) {
          errors.customerStatus = t("form.options.fieldRequired");
        }
        if (!formData.fullName) {
          errors.fullName = t("form.options.fieldRequired");
        }
        if (!formData.phoneNumber) {
          errors.phoneNumber = t("form.options.fieldRequired");
        }
        if (!formData.privacyPolicy) {
          errors.privacyPolicy = t("form.options.privacyPolicyRequired");
        }
        break;
      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to update form data and clear validation errors for the updated field
  const updateFormData = (newData) => {
    setFormData(
      (prevData) => ({
        ...prevData,
        ...newData,
      }),
      localStorage.setItem("formData", formData)
    );

    // Clear validation errors only for the fields that were updated
    const updatedFields = Object.keys(newData);
    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      updatedFields.forEach((field) => {
        if (newData[field]) {
          delete newErrors[field];
        }
      });
      return newErrors;
    });
  };

  // Function to completely reset the form
  const resetForm = () => {
    const defaultData = createDefaultForm();
    setFormData(defaultData);
    setCurrentStep(1);
    setEditId(null);
    setValidationErrors({});
    localStorage.removeItem("formData");
    localStorage.removeItem("formStep");
    //localStorage.clear();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData: updateFormData,
        resetForm,
        editId,
        setEditId,
        isAuthenticated,
        setIsAuthenticated,
        currentStep,
        setCurrentStep,
        validationErrors,
        setValidationErrors,
        validateStep,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
