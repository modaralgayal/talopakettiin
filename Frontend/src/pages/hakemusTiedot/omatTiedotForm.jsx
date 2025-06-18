import React from "react";
import { useTranslation } from "react-i18next";
import { OptionRender } from "../../components/optionRender";

export const OmatTiedotForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();

  const handleRadioChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t("form.steps.personalInfo")}
      </h2>

      {/* Customer Status */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.customerStatus")} *
          {validationErrors.customerStatus && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.customerStatus}
            </span>
          )}
        </label>
        <div className="space-y-3">
          {[
            t("form.options.lead1"),
            t("form.options.lead2"),
            t("form.options.lead3"),
          ].map((option) => (
            <div key={option} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="radio"
                  id={`customerStatus-${option}`}
                  name="customerStatus"
                  value={option}
                  checked={formData.customerStatus === option}
                  onChange={(e) =>
                    handleRadioChange("customerStatus", e.target.value)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor={`customerStatus-${option}`}
                  className="font-medium text-gray-700"
                >
                  {option}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Has Plot */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.options.hasPlot")} *
        </label>
        <div className="flex gap-4 mt-2">
          {[t("form.options.yes"), t("form.options.no")].map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name="hasPlot"
                value={option}
                checked={formData.hasPlot === option}
                onChange={(e) => handleRadioChange("hasPlot", e.target.value)}
                className="accent-blue-500"
                required
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.additionalInfo")}
        </label>
        <textarea
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
          rows="4"
          value={formData.additionalInfo || ""}
          onChange={(e) =>
            setFormData({ ...formData, additionalInfo: e.target.value })
          }
          placeholder={t("form.options.enterDetails")}
        />
      </div>

      <OptionRender
        field={"fullName"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        fieldType="input"
        showDetailsOnYes
      />

      <OptionRender
        field={"phoneNumber"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        fieldType="input"
        showDetailsOnYes
      />

      {/* Privacy Policy Checkbox */}
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="privacyPolicy"
              name="privacyPolicy"
              checked={formData.privacyPolicy || false}
              onChange={(e) =>
                setFormData({ ...formData, privacyPolicy: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="privacyPolicy"
              className="font-medium text-gray-700"
            >
              {t("form.fields.privacyPolicyAgreement")} *
            </label>
            <p className="text-gray-500 mt-1">
              {t("form.fields.privacyPolicyDescription")}{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {t("navigation.privacyPolicy")}
              </a>
            </p>
          </div>
        </div>
        {validationErrors.privacyPolicy && (
          <span className="text-red-500 text-sm">
            {validationErrors.privacyPolicy}
          </span>
        )}
      </div>
    </div>
  );
};
