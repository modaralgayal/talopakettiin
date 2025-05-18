import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { OptionRender } from "../../components/optionRender";

export const TalotekniikkaForm = ({
  formData,
  setFormData,
  validationErrors,
}) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState({
    interestedInOther: false,
    wantsInOfferOther: false,
  });

  // Memoize the translated 'other' value to avoid unnecessary effect triggers
  const otherOption = t("form.options.other");

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      interestedInOther: (formData.interestedIn || []).includes(otherOption),
      wantsInOfferOther: (formData.wantsInOffer || []).includes(otherOption),
    });
  }, [formData.interestedIn, formData.wantsInOffer, otherOption]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t("form.steps.technical")}
      </h2>

      <OptionRender
        field={"interestedIn"}
        formData={formData}
        setFormData={setFormData}
        fieldType="checkBox"
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"wantsInOffer"}
        formData={formData}
        setFormData={setFormData}
        fieldType="checkBox"
        validationErrors={validationErrors}
      />

      {/* Muu Tieto */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.otherInfo")}
        </label>
        <textarea
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
          rows="4"
          value={formData.otherInfo || ""}
          onChange={(e) =>
            setFormData({ ...formData, otherInfo: e.target.value })
          }
          placeholder={t("form.options.enterDetails")}
        />
      </div>
    </div>
  );
};
