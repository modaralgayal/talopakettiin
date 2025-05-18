import React, { useEffect, useState } from "react";
import { getUserForms, deleteUserEntry } from "../controllers/formController";
import { RenderFormData } from "../components/renderFormData";
import {
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaEdit,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/formContext";

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    entryId: null,
    applicationName: null,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setFormData, setEditId } = useFormContext();

  const fetchApplications = async () => {
    try {
      const response = await getUserForms();
      //console.log("Fetched applications:", response);

      // Ensure each application has a unique ID and valid entryId
      const uniqueApplications = response.map((app, index) => {
        console.log(`Processing application ${index}:`, app);
        return {
          ...app,
          uniqueId: `${app.entryId}-${index}`,
          entryId: app.entryId || `temp-${index}`, // Ensure entryId is never undefined
        };
      });

      //console.log("Processed applications with unique IDs:", uniqueApplications);
      setApplications(uniqueApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDeleteClick = (entryId, name) => {
    console.log("Delete clicked for entryId:", entryId, "Name:", name);

    if (!entryId) {
      console.error("Invalid entryId:", entryId);
      setDeleteError("Invalid application ID. Please try again.");
      return;
    }

    setDeleteConfirmation({
      show: true,
      entryId,
      applicationName: name, // <-- Fix here
    });
  };

  const handleDeleteConfirm = async () => {
    console.log("Delete confirmed for entryId:", deleteConfirmation.entryId);

    if (!deleteConfirmation.entryId) {
      console.error(
        "Invalid entryId in confirmation:",
        deleteConfirmation.entryId
      );
      setDeleteError("Invalid application ID. Please try again.");
      setDeleteConfirmation({
        show: false,
        entryId: null,
        applicationName: null,
      });
      return;
    }

    try {
      console.log("Attempting to delete entryId:", deleteConfirmation.entryId);
      await deleteUserEntry(deleteConfirmation.entryId);
      console.log("Successfully deleted entryId:", deleteConfirmation.entryId);

      setDeleteError(null);
      setDeleteConfirmation({
        show: false,
        entryId: null,
        applicationName: null,
      });
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      setDeleteError("Error deleting application. Please try again.");
    }
  };

  const handleDeleteCancel = () => {
    console.log("Delete cancelled");
    setDeleteConfirmation({
      show: false,
      entryId: null,
      applicationName: null,
    });
  };

  // Function to filter out empty or undefined values
  const filterEmptyValues = (obj) => {
    const result = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value && value !== "") {
          result[key] = value;
        }
      }
    }
    return result;
  };

  const filteredApplications = applications.filter((app) => {
    const formData = filterEmptyValues(app.formData);
    const searchLower = searchTerm.toLowerCase();

    return (
      (formData.city && formData.city.toLowerCase().includes(searchLower)) ||
      (formData.province &&
        formData.province.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Omat hakemukset
          </h1>
          <p className="text-lg text-gray-600">
            Tarkastele ja hallitse hakemuksiasi
          </p>
        </div>

        {/* Add search input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Hae kaupungin tai maakunnan perusteella..."
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {deleteError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{deleteError}</p>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">
              Sinulla ei ole vielä hakemuksia.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application, index) => {
              const formData = filterEmptyValues(application.formData);
              const title = formData.applicationName || "No Data";
              const isExpanded = expandedIndex === index;
              //console.log(application);

              return (
                <div
                  key={application.uniqueId}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {title}
                        </h2>
                        <p className="text-gray-600">
                          Tila: {application.status}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() =>
                            setExpandedIndex(isExpanded ? null : index)
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
                          onClick={() => {
                            setFormData(formData);
                            setEditId(application.id);
                            navigate("/formpage");
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                        >
                          <FaEdit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(
                              application.id,
                              application.formData.applicationName
                            )
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && <RenderFormData formData={formData} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmation.show && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <FaExclamationTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">
                  Vahvista poisto
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Haluatko varmasti poistaa hakemuksen nimetä "
                {deleteConfirmation.applicationName}"? Tätä toimintoa ei voi
                perua.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Peruuta
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Poista
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
