import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { OptionRender } from "../../components/optionRender";

export const UlkopuoliForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t("form.steps.exterior")}
      </h2>

      <OptionRender
        field={"houseShape"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"roofType"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"houseStyle"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"houseMaterial"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"roof"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />
    </div>
  );
};
