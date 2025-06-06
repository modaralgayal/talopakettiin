import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import { Helmet } from "react-helmet-async";
import { FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { RenderFormData } from "../../components/renderFormData";
import {
  deleteUserEntry,
  getAllEntries,
} from "../../controllers/formController";

export const ApplicationManagementPage = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [expandedOffer, setExpandedOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleViewPdf = (pdfFile) => {
    console.log("pdfFile type:", typeof pdfFile, pdfFile);

    if (pdfFile && pdfFile.M && pdfFile.M.buffer && pdfFile.M.buffer.S) {
      const base64Pdf = pdfFile.M.buffer.S;
      if (base64Pdf.startsWith("JVBER")) {
        const pdfWindow = window.open();
        pdfWindow.document.write(
          `<embed src="data:application/pdf;base64,${base64Pdf}" width="100%" height="100%" />`
        );
      } else {
        alert("Invalid PDF data.");
      }
    } else {
      alert("No PDF available.");
    }
  };

  const fetchAllData = async (entryType) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllEntries(entryType);

      if (entryType == "offer") {
        const rawOffers = response.entries || [];

        const normalizedOffers = rawOffers.map((entry) => {
          const parsedOfferData = entry.offerData || {};
          return {
            ...entry,
            ...parsedOfferData, // flatten offerData into root
          };
        });

        setOffers(normalizedOffers);
        console.log("These are the normalized offers: ", normalizedOffers);
      } else {
        const rawEntries = response.entries || [];

        const allEntries = rawEntries.map((entry) => ({
          ...entry,
          formData: filterEmptyValues(entry.formData || {}),
        }));

        const apps = allEntries.filter(
          (entry) => entry.entryType === "application"
        );

        setApplications(apps);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData("application");
    fetchAllData("offer");
  }, []);

  const handleDelete = async (entryId, type) => {
    console.log(entryId);
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;
    try {
      const response = await deleteUserEntry(entryId);
      if (response.success) {
        fetchAllData("application");
        fetchAllData("offer");
      } else {
        setError("Failed to delete item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("An error occurred while deleting the item.");
    }
  };

  const getString = (field) => field?.S?.toLowerCase?.() || "";

  const filteredApplications = applications.filter((app) => {
    const formData = app.formData || {};
    //console.log(formData)
    const searchLower = searchTerm.toLowerCase();

    return (
      getString(formData.city).includes(searchLower) ||
      getString(formData.province).includes(searchLower) ||
      app.email?.toLowerCase().includes(searchLower)
    );
  });

  const filteredOffers = offers.filter((offer) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      getString(offer.customerEmail).includes(searchLower) ||
      getString(offer.providerEmail).includes(searchLower) ||
      getString(offer.offerData?.firmName).includes(searchLower) ||
      getString(offer.offerData?.description).includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>{`Talopakettiin - Application Management`}</title>
        <meta
          name="description"
          content="Admin Application Management - Talopakettiin"
        />
        <link rel="canonical" href="/admin/application-management" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Application Management
          </h1>
          {/*
            Search: 
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by city, province, or email..."
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Applications */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Applications ({filteredApplications.length})
                  </h2>
                  <div className="space-y-4">
                    {filteredApplications.map((application) => {
                      const isExpanded = expandedApplication === application.id;

                      return (
                        <div
                          key={application.id}
                          className="bg-gray-50 rounded-lg shadow-sm overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900">
                                  {application.formData?.applicationName ||
                                    "Unnamed Application"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Customer: {application.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Status: {application.status}
                                </p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() =>
                                    setExpandedApplication(
                                      isExpanded ? null : application.id
                                    )
                                  }
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  {isExpanded ? (
                                    <FaChevronUp className="h-5 w-5" />
                                  ) : (
                                    <FaChevronDown className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(application.id, "application")
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash className="h-5 w-5" />
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="mt-4 p-4 bg-white rounded-lg">
                                <RenderFormData
                                  formData={application.formData}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Offers */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Offers ({filteredOffers.length})
                  </h2>
                  <div className="space-y-4">
                    {filteredOffers.map((offer, index) => {
                      const isExpanded = expandedOffer === offer.id;

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                {getString(offer.firmName)}
                              </h3>
                              <p className="text-gray-600 mb-2">
                                <span className="font-medium">Provider:</span>{" "}
                                {getString(offer.providerEmail)}
                              </p>
                              <p className="text-gray-700">
                                {getString(offer.description)}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-3xl font-bold text-blue-600">
                                {getString(offer.price)} €
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Total price
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end space-x-3">
                            {offer.pdfFile && (
                              <button
                                onClick={() => handleViewPdf(offer.pdfFile)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                                View Proposal
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(offer.id, "offer")}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Delete
                            </button>

                            {offer.status === "Accepted" ? (
                              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2 text-yellow-600"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Offer Accepted
                              </span>
                            ) : (
                              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Offer Pending
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
