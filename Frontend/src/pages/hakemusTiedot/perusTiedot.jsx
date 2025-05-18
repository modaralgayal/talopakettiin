import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/languageContext";
import { OptionRender } from "../../components/optionRender";

const provinces = {
  Ahvenanmaa: [
    "Brändö",
    "Eckerö",
    "Finström",
    "Föglö",
    "Geta",
    "Hammarland",
    "Jomala",
    "Kumlinge",
    "Kökar",
    "Lemland",
    "Lumparland",
    "Mariehamn",
    "Saltvik",
    "Sottunga",
    "Sund",
    "Vårdö",
  ],
  "Etelä-Karjala": [
    "Imatra",
    "Lappeenranta",
    "Lemi",
    "Luumäki",
    "Parikkala",
    "Rautjärvi",
    "Ruokolahti",
    "Savitaipale",
    "Taipalsaari",
  ],
  "Etelä-Pohjanmaa": [
    "Alajärvi",
    "Alavus",
    "Evijärvi",
    "Ilmajoki",
    "Isojoki",
    "Isokyrö",
    "Jalasjärvi",
    "Kauhajoki",
    "Kauhava",
    "Kuortane",
    "Kurikka",
    "Lappajärvi",
    "Lapua",
    "Seinäjoki",
    "Soini",
    "Teuva",
    "Vimpeli",
    "Ähtäri",
  ],
  "Etelä-Savo": [
    "Enonkoski",
    "Hirvensalmi",
    "Juva",
    "Kangasniemi",
    "Mikkeli",
    "Pertunmaa",
    "Pieksämäki",
    "Puumala",
    "Rantasalmi",
    "Savonlinna",
    "Sulkava",
  ],
  Kainuu: [
    "Hyrynsalmi",
    "Kajaani",
    "Kuhmo",
    "Paltamo",
    "Puolanka",
    "Ristijärvi",
    "Sotkamo",
    "Suomussalmi",
  ],
  "Kanta-Häme": [
    "Forssa",
    "Hattula",
    "Hausjärvi",
    "Humppila",
    "Hämeenlinna",
    "Janakkala",
    "Jokioinen",
    "Loppi",
    "Riihimäki",
    "Tammela",
    "Ypäjä",
  ],
  "Keski-Pohjanmaa": [
    "Halsua",
    "Kannus",
    "Kaustinen",
    "Kokkola",
    "Lestijärvi",
    "Perho",
    "Toholampi",
    "Veteli",
  ],
  "Keski-Suomi": [
    "Hankasalmi",
    "Jämsä",
    "Jyväskylä",
    "Joutsa",
    "Kannonkoski",
    "Karstula",
    "Keuruu",
    "Kinnula",
    "Kivijärvi",
    "Konnevesi",
    "Kyyjärvi",
    "Laukaa",
    "Luhanka",
    "Multia",
    "Muurame",
    "Petäjävesi",
    "Pihtipudas",
    "Saarijärvi",
    "Toivakka",
    "Uurainen",
    "Viitasaari",
  ],
  Kymenlaakso: [
    "Hamina",
    "Kotka",
    "Kouvola",
    "Miehikkälä",
    "Pyhtää",
    "Virolahti",
  ],
  Lappi: [
    "Enontekiö",
    "Inari",
    "Kemi",
    "Kemijärvi",
    "Keminmaa",
    "Kittilä",
    "Kolari",
    "Muonio",
    "Pelkosenniemi",
    "Pello",
    "Posio",
    "Ranua",
    "Rovaniemi",
    "Salla",
    "Savukoski",
    "Simo",
    "Sodankylä",
    "Tervola",
    "Tornio",
    "Utsjoki",
    "Ylitornio",
  ],
  Pirkanmaa: [
    "Akaa",
    "Hämeenkyrö",
    "Ikaalinen",
    "Juupajoki",
    "Kangasala",
    "Kihniö",
    "Lempäälä",
    "Mänttä-Vilppula",
    "Nokia",
    "Orivesi",
    "Parkano",
    "Pirkkala",
    "Pälkäne",
    "Ruovesi",
    "Sastamala",
    "Tampere",
    "Valkeakoski",
    "Vesilahti",
    "Virrat",
    "Ylöjärvi",
  ],
  Pohjanmaa: [
    "Isokyrö",
    "Kaskinen",
    "Korsnäs",
    "Kristiinankaupunki",
    "Kruunupyy",
    "Laihia",
    "Luoto",
    "Maalahti",
    "Mustasaari",
    "Närpiö",
    "Pedersören kunta",
    "Pietarsaari",
    "Uusikaarlepyy",
    "Vaasa",
    "Vöyri",
  ],
  "Pohjois-Karjala": [
    "Heinävesi",
    "Ilomantsi",
    "Joensuu",
    "Juuka",
    "Kontiolahti",
    "Lieksa",
    "Liperi",
    "Nurmes",
    "Outokumpu",
    "Polvijärvi",
    "Rääkkylä",
    "Tohmajärvi",
  ],
  "Pohjois-Pohjanmaa": [
    "Haapajärvi",
    "Haapavesi",
    "Hailuoto",
    "Haukipudas",
    "Ii",
    "Kalajoki",
    "Kempele",
    "Kestilä",
    "Kiiminki",
    "Kuivaniemi",
    "Kuusamo",
    "Liminka",
    "Lumijoki",
    "Merijärvi",
    "Muhos",
    "Nivala",
    "Oulainen",
    "Oulu",
    "Pudasjärvi",
    "Pyhäjoki",
    "Pyhäjärvi",
    "Pyhäntä",
    "Raahe",
    "Reisjärvi",
    "Sievi",
    "Siikajoki",
    "Siikalatva",
    "Tyrnävä",
    "Utajärvi",
    "Vaala",
    "Vihanti",
    "Yli-Ii",
    "Ylivieska",
  ],
  "Pohjois-Savo": [
    "Iisalmi",
    "Joroinen",
    "Kaavi",
    "Keitele",
    "Kiuruvesi",
    "Kuopio",
    "Lapinlahti",
    "Leppävirta",
    "Pielavesi",
    "Rautalampi",
    "Rautavaara",
    "Siilinjärvi",
    "Sonkajärvi",
    "Suonenjoki",
    "Tervo",
    "Tuusniemi",
    "Varkaus",
    "Vesanto",
    "Vieremä",
  ],
  "Päijät-Häme": [
    "Asikkala",
    "Hartola",
    "Heinola",
    "Hollola",
    "Iitti",
    "Kärkölä",
    "Lahti",
    "Orimattila",
    "Padasjoki",
    "Sysmä",
  ],
  Satakunta: [
    "Eura",
    "Eurajoki",
    "Harjavalta",
    "Huittinen",
    "Jämijärvi",
    "Kankaanpää",
    "Karvia",
    "Kokemäki",
    "Merikarvia",
    "Nakkila",
    "Pomarkku",
    "Pori",
    "Rauma",
    "Siikainen",
    "Säkylä",
    "Ulvila",
  ],
  Uusimaa: [
    "Askola",
    "Espoo",
    "Hanko",
    "Helsinki",
    "Hyvinkää",
    "Inkoo",
    "Järvenpää",
    "Kauniainen",
    "Kerava",
    "Kirkkonummi",
    "Lapinjärvi",
    "Loviisa",
    "Lohja",
    "Mäntsälä",
    "Nurmijärvi",
    "Pornainen",
    "Porvoo",
    "Raasepori",
    "Sipoo",
    "Siuntio",
    "Tuusula",
    "Vantaa",
    "Vihti",
  ],
  "Varsinais-Suomi": [
    "Aura",
    "Kaarina",
    "Kemiönsaari",
    "Kustavi",
    "Laitila",
    "Lieto",
    "Loimaa",
    "Marttila",
    "Masku",
    "Mynämäki",
    "Naantali",
    "Nousiainen",
    "Oripää",
    "Paimio",
    "Parainen",
    "Pöytyä",
    "Raisio",
    "Rusko",
    "Rymättylä",
    "Salo",
    "Sauvo",
    "Somero",
    "Taivassalo",
    "Turku",
    "Uusikaupunki",
    "Vehmaa",
  ],
};

export const PerustiedotForm = ({
  formData,
  setFormData,
  validationErrors,
}) => {
  //console.log("These are the validationErrors: ", validationErrors)
  const { t } = useTranslation();
  const [filteredCities, setFilteredCities] = useState([]);

  // Initialize all possible fields in formData
  const initialDetailsState = {
    utilityRoom: false,
    mudroom: false,
    terrace: false,
    carport: false,
    garage: false,
  };

  const [showDetails, setShowDetails] = useState(initialDetailsState);

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      utilityRoom: formData.utilityRoom === t("form.options.yes"),
      mudroom: formData.mudroom === t("form.options.yes"),
      terrace: formData.terrace === t("form.options.yes"),
      carport: formData.carport === t("form.options.yes"),
      garage: formData.garage === t("form.options.yes"),
    });
  }, [
    formData.utilityRoom,
    formData.mudroom,
    formData.terrace,
    formData.carport,
    formData.garage,
    t,
  ]);

  useEffect(() => {
    if (formData.province && provinces[formData.province]) {
      setFilteredCities(provinces[formData.province]);
      // Reset city if it no longer matches
      if (!provinces[formData.province].includes(formData.city)) {
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setFilteredCities([]);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [formData.province]);

  // Handle radio button changes
  const handleRadioChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
      // Clear details if "No" is selected
      ...(value === t("form.options.no") && { [`${field}Details`]: "" }),
    });
    setShowDetails((prev) => ({
      ...prev,
      [field]: value === t("form.options.yes"),
    }));
  };

  // Handle number inputs with validation
  const handleNumberInput = (field, value) => {
    const numValue = value === "" ? "" : Number(value);

    // Create a new form data object with the updated field
    const newFormData = {
      ...formData,
      [field]: numValue,
    };

    // Update the formatted range fields
    if (field === "minBudget" || field === "maxBudget") {
      const min = field === "minBudget" ? numValue : newFormData.minBudget;
      const max = field === "maxBudget" ? numValue : newFormData.maxBudget;

      if (min !== "" && max !== "") {
        newFormData.budget = `${min} € - ${max} €`;
      }
    }

    if (field === "minSize" || field === "maxSize") {
      const min = field === "minSize" ? numValue : newFormData.minSize;
      const max = field === "maxSize" ? numValue : newFormData.maxSize;

      if (min !== "" && max !== "") {
        newFormData.houseSize = `${min} m² - ${max} m²`;
      }
    }

    // Update the form data with all changes at once
    setFormData(newFormData);
  };

  // Handle text input changes
  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Modular radio fields
  const radioFields = [
    { field: "utilityRoom" },
    { field: "mudroom" },
    { field: "terrace" },
    { field: "carport" },
    { field: "garage" },
  ];

  // Map Finnish details field names to English translation keys for translation
  const detailsFieldTranslationMap = {
    utilityRoomDetails: "utilityRoomDetails",
    mudroomDetails: "mudroomDetails",
    terraceDetails: "terraceDetails",
    carportDetails: "carportDetails",
    garageDetails: "garageDetails",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t("form.steps.basicInfo")}
      </h2>

      <OptionRender
        field={"applicationName"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        fieldType="input"
        showDetailsOnYes
      />

      {/* Province (Required) */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.province")} *
          {validationErrors.province && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.province}
            </span>
          )}
        </label>
        <select
          className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.province ? "border-red-500" : ""
          }`}
          value={formData.province || ""}
          onChange={(e) => handleTextInput("province", e.target.value)}
          required
        >
          <option value="">{t("form.options.selectProvince")}</option>
          {Object.keys(provinces).map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* City (Required) */}
      {formData.province && (
        <>
          <label className="block text-lg font-medium text-gray-700">
            {t("form.fields.city")} *
            {validationErrors.province && (
              <span className="text-red-500 text-sm ml-2">
                {validationErrors.province}
              </span>
            )}
          </label>
          <select
            className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.city ? "border-red-500" : ""
            }`}
            value={formData.city || ""}
            onChange={(e) => handleTextInput("city", e.target.value)}
            required
          >
            <option value="">{t("form.options.selectCity")}</option>
            {filteredCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </>
      )}

      <OptionRender
        field={"houseType"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"delivery"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      {/* Floors */}
      <OptionRender
        field={"stories"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      {/* Budget (Required) */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.budget")} *
          {validationErrors.budget && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.budget}
            </span>
          )}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min €"
            className={`w-1/2 p-3 border rounded-lg ${
              validationErrors.budget ? "border-red-500" : ""
            }`}
            value={formData.minBudget ?? ""}
            onChange={(e) => handleNumberInput("minBudget", e.target.value)}
            min="0"
            step={1000}
            required
          />
          <input
            type="number"
            placeholder="Max €"
            className={`w-1/2 p-3 border rounded-lg ${
              validationErrors.budget ? "border-red-500" : ""
            }`}
            value={formData.maxBudget ?? ""}
            onChange={(e) => handleNumberInput("maxBudget", e.target.value)}
            min={formData.minBudget || "0"}
            step={1000}
            required
          />
        </div>
      </div>

      {/* House Size (Required) */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.houseSize")} *
          {validationErrors.houseSize && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.houseSize}
            </span>
          )}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min m²"
            className={`w-1/2 p-3 border rounded-lg ${
              validationErrors.houseSize ? "border-red-500" : ""
            }`}
            value={formData.minSize ?? ""}
            onChange={(e) => handleNumberInput("minSize", e.target.value)}
            min="0"
            step={5}
            required
          />
          <input
            type="number"
            placeholder="Max m²"
            className={`w-1/2 p-3 border rounded-lg ${
              validationErrors.houseSize ? "border-red-500" : ""
            }`}
            value={formData.maxSize ?? ""}
            onChange={(e) => handleNumberInput("maxSize", e.target.value)}
            min={formData.minSize || "0"}
            step={5}
            required
          />
        </div>
      </div>

      {/* Number of Bedrooms */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.bedrooms")} *
          {validationErrors.bedrooms && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.bedrooms}
            </span>
          )}
        </label>
        <select
          className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.bedrooms ? "border-red-500" : ""
          }`}
          value={formData.bedrooms || ""}
          onChange={(e) => handleTextInput("bedrooms", e.target.value)}
          required
        >
          <option value="">{t("form.options.selectAmount")}</option>
          {[1, 2, 3, 4, 5, 6, 7, "8+"].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Modularized Radio Fields */}
      {radioFields.map(({ field }) => (
        <OptionRender
          key={field}
          field={field}
          formData={formData}
          setFormData={setFormData}
          validationErrors={validationErrors}
          fieldType="radio"
          showDetailsOnYes
        />
      ))}
    </div>
  );
};
