import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllEntries,
  getOffersForProvider,
} from "../controllers/formController";
import { useOfferContext } from "../context/offerContext";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBuilding,
  FaEuroSign,
  FaRuler,
  FaCheck,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { RenderFormData } from "../components/renderFormData";
export const ViewCustomerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [openedAppIndex, setOpenedAppIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();

  const { updateOfferData } = useOfferContext();

  const { t } = useTranslation();

  useEffect(() => {
    getAllEntries("application")
      .then((response) => {
        console.log(response.entries);
        setApplications(response.entries || []);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getOffersForProvider()
      .then((response) => {
        console.log("Offers response:", response.data);
        const offersData = Array.isArray(response.data?.offers)
          ? response.data.offers
          : [];
        console.log("Offers data:", offersData);
        setOffers(offersData);
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
        setOffers([]);
      });
  }, []);

  const parseValue = (val) => {
    if (!val) return "";
    if (val.S) return val.S;
    if (val.N) return val.N;
    if (val.L) return val.L.map(parseValue).join(", ");
    return "";
  };

  const filterEmptyValues = (formData) => {
    const result = {};
    for (let key in formData) {
      const value = parseValue(formData[key]);
      if (value && value !== "") {
        result[key] = value;
      }
    }
    return result;
  };

  const filteredApplications = applications.filter((app) => {
    const formData = filterEmptyValues(app.formData || {});
    const searchLower = searchTerm.toLowerCase();

    // Use translation keys as in the new implementation
    const city = formData.city || "";
    const province = formData.province || "";

    return (
      city.toLowerCase().includes(searchLower) ||
      province.toLowerCase().includes(searchLower)
    );
  });

  const handleToggle = (index) => {
    setOpenedAppIndex(index === openedAppIndex ? null : index);
  };

  const handleOffer = (customerEmail, entryId, formData) => {
    updateOfferData({
      entryId,
      formData,
      price: "",
      firmName: "",
      description: "",
      providerEmail: "",
      customerEmail: customerEmail,
      userType: "provider",
    });
    console.log("Form data: ", formData);
    navigate("/makeoffer", { state: { id: entryId } });
  };

  const hasOffer = (entryId) => {
    if (!Array.isArray(offers)) {
      console.warn("offers is not an array:", offers);
      return false;
    }
    return offers.some((offer) => offer && offer.entryId === entryId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kaikki hakemukset
          </h1>
          <p className="text-lg text-gray-600">
            Selaa ja suodata hakemuksia sijainnin mukaan
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Hae kaupungin tai maakunnan mukaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Applications Grid */}
        <div className="flex flex-col gap-6 w-full">
          {filteredApplications.map((app, index) => {
            const formData = filterEmptyValues(app.formData || {});
            const city = formData.applicationName || `Hakemus ${index + 1}`;
            const province = formData.province || "Ei määritelty";
            const budget = formData.budget || "Ei määritelty";
            const size = formData.houseSize || "Ei määritelty";
            const bedrooms = formData.bedrooms || "Ei määritelty";

            return (
              <div
                key={app.entryId}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {city}
                    </h2>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      {app.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{province}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaEuroSign className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{budget}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaRuler className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{size}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => handleToggle(index)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {openedAppIndex === index
                        ? "Piilota tiedot"
                        : "Näytä tiedot"}
                    </button>
                    {hasOffer(app.id) ? (
                      <button
                        disabled
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 cursor-not-allowed"
                      >
                        <FaCheck className="h-4 w-4 mr-2" />
                        Tarjous tehty
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleOffer(app.customerEmail, app.id, formData)
                        }
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaBuilding className="h-4 w-4 mr-2" />
                        Tee tarjous
                      </button>
                    )}
                  </div>
                </div>

                {/* Application details */}
                {openedAppIndex === index && (
                  <RenderFormData formData={formData} />
                )}
              </div>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Ei hakemuksia näytettäväksi</p>
          </div>
        )}
      </div>
    </div>
  );
};
