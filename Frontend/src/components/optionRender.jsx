import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const OptionRender = ({
  field,
  formData,
  setFormData,
  validationErrors,
  fieldType = "option",
  required = true,
  showDetailsOnYes = false,
}) => {
  const { t } = useTranslation();
  const [fieldOptions, setOptions] = useState([]);
  const [placeHolder, setPlaceHolder] = useState("");

  useEffect(() => {
    const placeholder = t(`form.fields.${field}Placeholder`);
    if (!placeholder.startsWith("form.fields")) {
      setPlaceHolder(placeholder);
    }
  }, [field, t]);

  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      [field]: value,
      // Clear the other field if not selecting enterOther
      ...(value !== "enterOther" && { [`${field}Other`]: "" }),
    });
  };

  const handleCheckboxChange = (option) => {
    const current = formData[field] || [];
    let updated;
    if (current.includes(option)) {
      updated = current.filter((item) => item !== option);
    } else {
      updated = [...current, option];
    }
    // If unchecking enterOther, clear the other field
    setFormData({
      ...formData,
      [field]: updated,
      ...(option === "enterOther" &&
        !updated.includes("enterOther") && { [`${field}Other`]: "" }),
    });
  };

  // Handler for the 'other' input
  const handleOtherInputChange = (value) => {
    setFormData({
      ...formData,
      [`${field}Other`]: value,
    });
  };

  // Handler for the details input (for radio fields)
  const handleDetailsInputChange = (value) => {
    setFormData({
      ...formData,
      [`${field}Details`]: value,
    });
  };

  // Handler for the how many cars input
  const handleHowManyInputChange = (value) => {
    setFormData({
      ...formData,
      [`${field}HowMany`]: value,
    });
  };

  useEffect(() => {
    console.log("fetching values...");
    const fetchedVals = t(`form.options.${field}`, { returnObjects: true });
    // console.log("These are the fetched values: ", fetchedVals);

    if (fetchedVals) {
      const keys = Object.keys(fetchedVals);
      setOptions(keys);
    }
  }, [field, t]);
  // Show the 'other' input if enterOther is selected/checked
  const isOtherSelected =
    (fieldType === "option" && formData[field] === "enterOther") ||
    (fieldType === "checkBox" &&
      Array.isArray(formData[field]) &&
      formData[field].includes("enterOther"));

  const yesValue = t("form.options.yes");
  const noValue = t("form.options.yes");

  // Show the details input if showDetailsOnYes and 'Kyllä' is selected
  const showDetails =
    fieldType === "radio" && showDetailsOnYes && formData[field] === yesValue;
  const showHowMany =
    showDetails && (field === "garage" || field === "carport");

  return (
    <>
      {fieldType == "option" && (
        <>
          <label className="block text-lg font-medium text-gray-700">
            {t(`form.fields.${field}`)} {required && "*"}
            {validationErrors[field] && (
              <span className="text-red-500 text-sm ml-2">
                {validationErrors[field]}
              </span>
            )}
          </label>

          <select
            className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors[field] ? "border-red-500" : ""
            }`}
            value={formData[field] || ""}
            onChange={(e) => handleSelectChange(e.target.value)}
            required={required}
          >
            <option value="">{t(`form.options.select${field}`)}</option>
            {fieldOptions.map((option, index) => (
              <option key={index} value={option}>
                {t(`form.options.${field}.${option}`)}
              </option>
            ))}
          </select>
          {isOtherSelected && (
            <input
              type="text"
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder={t("form.options.enterOther")}
              value={formData[`${field}Other`] || ""}
              onChange={(e) => handleOtherInputChange(e.target.value)}
            />
          )}
        </>
      )}

      {fieldType === "checkBox" && (
        <div className="mt-4">
          <label className="block text-lg font-medium text-gray-700">
            {t(`form.fields.${field}`)} {required && "*"}
            {validationErrors[field] && (
              <span className="text-red-500 text-sm ml-2">
                {validationErrors[field]}
              </span>
            )}
          </label>
          <div className="mt-2 space-y-2">
            {fieldOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={(formData[field] || []).includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{t(`form.options.${field}.${option}`)}</span>
              </label>
            ))}
          </div>
          {isOtherSelected && (
            <input
              type="text"
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder={t("form.options.enterOther")}
              value={formData[`${field}Other`] || ""}
              onChange={(e) => handleOtherInputChange(e.target.value)}
            />
          )}
        </div>
      )}

      {fieldType === "radio" && (
        <div className="mt-4">
          <label className="block text-lg font-medium text-gray-700">
            {t(`form.fields.${field}`)} {required && "*"}
            {validationErrors[field] && (
              <span className="text-red-500 text-sm ml-2">
                {validationErrors[field]}
              </span>
            )}
          </label>
          <div className="flex gap-4 mt-2">
            {[yesValue, t("form.options.no")].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field}
                  value={option}
                  checked={formData[field] === option}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: e.target.value,
                      // Clear details if "Ei" is selected
                      ...(e.target.value === t("form.options.no") && {
                        [`${field}Details`]: "",
                        [`${field}HowMany`]: "",
                      }),
                    })
                  }
                  className="accent-blue-500"
                  required={required}
                />
                {option}
              </label>
            ))}
          </div>
          {showDetails && (
            <>
              {showHowMany && (
                <input
                  type="number"
                  className="w-full mt-2 p-3 border rounded-lg"
                  placeholder={t(`form.fields.${field}HowMany`)}
                  value={formData[`${field}HowMany`] || ""}
                  onChange={(e) => handleHowManyInputChange(e.target.value)}
                  min={1}
                />
              )}
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg"
                placeholder={t(`form.fields.${field}Details`)}
                value={formData[`${field}Details`] || ""}
                onChange={(e) => handleDetailsInputChange(e.target.value)}
              />
            </>
          )}
        </div>
      )}

      {fieldType == "input" && (
        <>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              {t(`form.fields.${field}`)} *
              {validationErrors[field] && (
                <span className="text-red-500 text-sm ml-2">
                  {validationErrors[field]}
                </span>
              )}
            </label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors[field] ? "border-red-500" : ""
              }`}
              value={formData[field] || ""}
              onChange={(e) =>
                handleTextInput(field, e.target.value.slice(0, 30))
              }
              maxLength={30}
              required
              placeholder={placeHolder || ""}
            />
          </div>
        </>
      )}
    </>
  );
};
