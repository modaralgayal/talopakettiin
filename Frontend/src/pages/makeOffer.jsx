import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOfferContext } from "../context/offerContext";
import {
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaEuroSign,
  FaRuler,
} from "react-icons/fa";
import { sendOffer } from "../controllers/offerController";
import { useTranslation } from "react-i18next";
import { RenderFormData } from "../components/renderFormData";

const MakeOffer = () => {
  const { offerData, updateOfferData } = useOfferContext();
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const location = useLocation();
  const applicationId = location.state?.id;
  console.log("This is the application: ", applicationId);
  console.log("This is the offerData: ", offerData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // Ensure offerData.entryId and customerEmail are set to the application being offered to
      let updatedOfferData = { ...offerData };
      console.log("Updated offer data:", updatedOfferData);

      // Ensure entryId is set
      if (
        !updatedOfferData.entryId &&
        updatedOfferData.formData &&
        updatedOfferData.formData.entryId
      ) {
        updatedOfferData.entryId = updatedOfferData.formData.entryId;
      }
      if (!updatedOfferData.entryId && applicationId) {
        updatedOfferData.entryId = applicationId;
      }

      // Ensure customerEmail is set
      if (!updatedOfferData.customerEmail && updatedOfferData.formData) {
        updatedOfferData.customerEmail =
          updatedOfferData.formData.customerEmail ||
          updatedOfferData.formData.email ||
          "";
      }

      await sendOffer(updatedOfferData, pdfFile);
      setSuccess(true);
      setTimeout(() => {
        navigate("/allapplications");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateOfferData({ ...offerData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      setError("Valitse kelvollinen PDF-tiedosto");
    }
  };

  if (!offerData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Ei valittua hakemusta
          </h1>
          <p className="mt-2 text-gray-600">
            Valitse ensin hakemus, jolle haluat tehdä tarjouksen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tee tarjous</h1>
          <p className="text-xl text-gray-600">
            Täytä tarjouksen tiedot alla olevaan lomakkeeseen
          </p>
        </div>

        {/* Application Preview Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-lg font-medium text-gray-900">
              Näytä hakemuksen tiedot
            </span>
            {isPreviewOpen ? (
              <FaChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <FaChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {/* Application Preview */}
          {isPreviewOpen && <RenderFormData formData={offerData.formData} />}
        </div>

        {/* Offer Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">Tarjous lähetetty onnistuneesti!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Yrityksen nimi *
              </label>
              <input
                type="text"
                name="firmName"
                value={offerData.firmName}
                onChange={handleInputChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Syötä yrityksesi nimi"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Hinta (€) *
              </label>
              <input
                type="number"
                name="price"
                value={offerData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="1000"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Syötä tarjouksen hinta"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Kuvaus *
              </label>
              <textarea
                name="description"
                value={offerData.description}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Kuvaile tarjouksesi sisältö ja erityispiirteet"
              />
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Liitä Tarjous PDF-tiedostona (valinnainen)
              </label>
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="pdfUpload"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer text-lg"
                >
                  Valitse tiedosto
                </label>
                {pdfFile && (
                  <span className="text-lg text-green-600">{pdfFile.name}</span>
                )}
              </div>
              <input
                id="pdfUpload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/allapplications")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg"
              >
                Peruuta
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg"
              >
                Lähetä tarjous
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default MakeOffer;
