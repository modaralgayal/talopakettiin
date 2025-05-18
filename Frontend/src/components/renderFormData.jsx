import { useTranslation } from "react-i18next";

export const RenderFormData = ({ formData }) => {
  const { t } = useTranslation();
  const sectionOrder = [
    {
      title: t("form.steps.basicInfo"),
      fields: [
        "applicationName",
        "province",
        "city",
        "houseType",
        "delivery",
        "stories",
        "budget",
        "houseSize",
        "bedrooms",
        "utilityRoom",
        "utilityRoomDetails",
        "mudroom",
        "mudroomDetails",
        "terrace",
        "terraceDetails",
        "carport",
        "carportDetails",
        "garage",
        "garageDetails",
      ],
    },
    {
      title: t("form.steps.exterior"),
      fields: [
        "roof",
        "roofOther",
        "houseMaterial",
        "houseMaterialOther",
        "houseShape",
        "houseShapeOther",
        "houseStyle",
        "houseStyleOther",
      ],
    },
    {
      title: t("form.steps.interior"),
      fields: [
        "floor",
        "floorDetails",
        "interiorWalls",
        "interiorWallsDetails",
        "ceiling",
        "ceilingDetails",
      ],
    },
    {
      title: t("form.steps.kitchen"),
      fields: [
        "kitchenType",
        "kitchenTypeOther",
        "kitchenAccessories",
        "kitchenAccessoriesOther",
      ],
    },
    {
      title: t("form.steps.heating"),
      fields: [
        "heatingType",
        "heatingTypeOther",
        "fireplace",
        "fireplaceHeatStorage",
        "directElectricHeating",
        "bakingOven",
        "bakingOvenDetails",
        "otherInfoIndoor",
      ],
    },
    {
      title: t("form.steps.technical"),
      fields: [
        "interestedIn",
        "interestedInOther",
        "wantsInOffer",
        "wantsInOfferOther",
      ],
    },
    {
      title: t("form.steps.personalInfo"),
      fields: ["customerStatus", "hasPlot", "additionalInfo"],
    },
  ];

  const renderFormDataRows = (formData, sectionTitle) => {
    const entries = Object.entries(formData);
    return entries.map(([key, value]) => {
      // Get the translated label for the field
      const label = t(`form.fields.${key}`);

      // Special handling for different field types
      if (
        [
          "interestedIn",
          "wantsInOffer",
          "heatingType",
          "heatingMethod",
          "",
        ].includes(key)
      ) {
        let displayValue = "-";
        if (Array.isArray(value) && value.length > 0) {
          displayValue = value
            .map((v) => {
              const translated = t(`form.options.${key}.${v}`);
              return translated !== `form.options.${key}.${v}` ? translated : v;
            })
            .join(", ");
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle yes/no/dontKnow fields
      if (
        [
          "utilityRoom",
          "mudroom",
          "terrace",
          "carport",
          "garage",
          "fireplace",
          "bakingOven",
        ].includes(key)
      ) {
        const displayValue =
          value === t("form.options.yes")
            ? t("form.options.yes")
            : value === t("form.options.no")
            ? t("form.options.no")
            : value === t("form.options.dontKnow")
            ? t("form.options.dontKnow")
            : value || "-";
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle select fields with predefined options
      const optionFields = [
        "houseMaterial",
        "roof",
        "floor",
        "interiorWalls",
        "ceiling",
        "houseShape",
        "houseStyle",
        "kitchenType",
        "kitchenAccessories",
        "delivery",
        "heatingType",
        "heatingMethod",
        "customerStatus",
        "houseType",
      ];
      if (optionFields.includes(key)) {
        let displayValue = "-";
        if (value) {
          // If value is 'enterOther', show translation for 'Other - What?'
          if (value === "enterOther") {
            displayValue = t("form.options.enterOther");
          } else {
            // Try to translate the value using the correct namespace
            const translated = t(`form.options.${key}.${value}`);
            displayValue =
              translated !== `form.options.${key}.${value}`
                ? translated
                : value;
          }
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // For fields ending in 'Other', just show the value (user input)
      if (key.endsWith("Other")) {
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{value || "-"}</span>
          </div>
        );
      }

      // Handle fireplaceHeatStorage and directElectricHeating with translation
      if (["fireplaceHeatStorage", "directElectricHeating"].includes(key)) {
        let displayValue = "-";
        if (value) {
          const translated = t(`form.options.${value}`);
          displayValue =
            translated !== `form.options.${value}` ? translated : value;
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle hasPlot with translation
      if (key === "hasPlot") {
        let displayValue = "-";
        if (value) {
          const translated = t(`form.options.${value}`);
          displayValue =
            translated !== `form.options.${value}` ? translated : value;
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle other fields (city, province, budget, etc.)
      const displayValue = value || "-";

      // Handle kitchen-specific fields
      if (key.startsWith("kitchen") && key !== "kitchenAdditionalInfo") {
        let displayValue = "-";
        if (value) {
          // Try to translate the value
          const translated = t(`form.kitchenOptions.${value}`);
          displayValue =
            translated !== `form.kitchenOptions.${value}` ? translated : value;
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      return (
        <div
          key={`${sectionTitle}-${key}`}
          className="flex justify-between items-center py-2 border-b"
        >
          <span className="font-medium">{label}:</span>
          <span className="text-gray-700">{displayValue}</span>
        </div>
      );
    });
  };

  return (
    <div className="p-6  mt-6 space-y-6">
      {sectionOrder.map((section) => {
        const sectionFields = section.fields.reduce((acc, field) => {
          if (formData[field]) {
            acc[field] = formData[field];
          }
          return acc;
        }, {});

        if (Object.keys(sectionFields).length > 0) {
          return (
            <div key={section.title}>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {section.title}
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                {renderFormDataRows(sectionFields, section.title)}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
