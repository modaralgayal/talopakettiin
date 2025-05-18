import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { OptionRender } from "../../components/optionRender";

export const SisapuoliForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();
  const initialDetailsState = {
    floor: false,
    interiorWalls: false,
    ceiling: false,
  };

  const [showDetails, setShowDetails] = useState(initialDetailsState);

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      floor: formData.floor === t("form.options.other"),
      interiorWalls: formData.interiorWalls === t("form.options.other"),
      ceiling: formData.ceiling === t("form.options.other"),
    });
  }, [formData.floor, formData.interiorWalls, formData.ceiling, t]);

  const dropdownFields = ["ceiling", "interiorWalls", "floor"];

  // Map Finnish details field names to English translation keys for translation
  const detailsFieldTranslationMap = {
    floorDetails: "floorDetails",
    interiorWallsDetails: "interiorWallsDetails",
    ceilingDetails: "ceilingDetails",
  };

  const handleDropdownChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
      ...(value !== t("form.options.other") && { [`${field}Details`]: "" }),
    });
    setShowDetails((prev) => ({
      ...prev,
      [field]: value === t("form.options.other"),
    }));
  };

  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t("form.steps.interior")}
      </h2>

      {dropdownFields.map((label) => (
        <OptionRender
          field={label}
          formData={formData}
          setFormData={setFormData}
          validationErrors={validationErrors}
        />
      ))}
    </div>
  );
};
