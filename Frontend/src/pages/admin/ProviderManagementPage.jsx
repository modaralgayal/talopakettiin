import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import { Helmet } from "react-helmet-async";

export const ProviderManagementPage = () => {
  const { t } = useTranslation();
  const [type, setType] = useState("email"); // 'email' or 'domain'
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error"); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [domains, setDomains] = useState([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  const fetchProvidersAndDomains = async () => {
    setIsLoadingLists(true);
    try {
      const [providersRes, domainsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/user/get-all-providers`, {
          withCredentials: true,
        }),
        axios.get(`${API_BASE_URL}/api/user/get-all-domain`, {
          withCredentials: true,
        }),
      ]);

      if (providersRes.data.success) {
        setProviders(providersRes.data.providerList || []);
      }
      if (domainsRes.data.success) {
        setDomains(domainsRes.data.domainList || []);
      }
    } catch (error) {
      console.error("Error fetching providers and domains:", error);
      showMessage("Error fetching providers and domains.", "error");
    } finally {
      setIsLoadingLists(false);
    }
  };

  useEffect(() => {
    fetchProvidersAndDomains();
  }, []);

  const handleDelete = async (item, idToDelete) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${item} as an eligible provider?`
      )
    ) {
      return;
    }

    console.log("Deleting this id: ", idToDelete);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/user/delete-domain-or-provider`,
        {
          withCredentials: true,
          data: { entryId: idToDelete },
        }
      );

      if (response.data.success) {
        showMessage("Successfully deleted item.", "success");
        fetchProvidersAndDomains(); // Refresh the list
      } else {
        showMessage(response.data.error || "Failed to delete item.", "error");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showMessage("An error occurred while deleting the item.", "error");
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const isValidEmail = (email) => {
    // Basic but solid email pattern
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidDomain = (domain) => {
    // Domain must be like "example.com", not include protocol or slashes
    return /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/.test(domain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!value.trim()) {
      showMessage("Please enter a value.", "error");
      return;
    }

    if (type === "email" && !isValidEmail(value.trim())) {
      showMessage("Invalid email format. Please check your input.", "error");
      return;
    }

    if (type === "domain" && !isValidDomain(value.trim())) {
      showMessage(
        "Invalid domain format. Use only the domain (e.g. example.com), no http:// or slashes.",
        "error"
      );
      return;
    }

    setIsLoading(true);
    try {
      const endpoint =
        type === "email"
          ? "/api/user/add-provider-email"
          : "/api/user/add-provider-domain";
      const body =
        type === "email" ? { email: value.trim() } : { domain: value.trim() };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, body, {
        withCredentials: true,
      });

      if (response.data.success) {
        showMessage(`Successfully added ${type}: ${value}`, "success");
        setValue(""); // Clear input after success
        fetchProvidersAndDomains();
      } else {
        showMessage(response.data.error || `Failed to add ${type}.`, "error");
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      showMessage(`Error adding ${type}.`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Helmet>
        <title>{`Talopakettiin - Provider Management`}</title>
        <meta
          name="description"
          content="Admin Provider Management - Talopakettiin"
        />
        <link rel="canonical" href="/admin/provider-management" />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Provider Management
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Add Provider by:
              </label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    value="email"
                    checked={type === "email"}
                    onChange={() => setType("email")}
                  />
                  <span className="ml-2 text-gray-700">Email</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    value="domain"
                    checked={type === "domain"}
                    onChange={() => setType("domain")}
                  />
                  <span className="ml-2 text-gray-700">Domain</span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="value"
                className="block text-sm font-medium text-gray-700"
              >
                {type === "email" ? "Provider Email" : "Provider Domain"}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="value"
                  id="value"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder={
                    type === "email"
                      ? "e.g. provider@example.com"
                      : "e.g. example.com"
                  }
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded ${
                  messageType === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading
                  ? "Adding..."
                  : `Add ${type === "email" ? "Email" : "Domain"}`}
              </button>
            </div>
          </form>

          {/* Lists Section */}
          <div className="mt-12 space-y-8">
            {/* Providers List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Verified Provider Emails
              </h2>
              {isLoadingLists ? (
                <p className="text-gray-500">Loading providers...</p>
              ) : providers.length > 0 ? (
                <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                  {providers.map((provider, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center px-4 py-3 text-sm text-gray-700"
                    >
                      <span>{provider.email}</span>
                      <button
                        onClick={() =>
                          handleDelete(provider.email, provider.id)
                        } // Or whatever the unique ID field is
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No verified provider emails found.
                </p>
              )}
            </div>

            {/* Domains List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Verified Provider Domains
              </h2>
              {isLoadingLists ? (
                <p className="text-gray-500">Loading domains...</p>
              ) : domains.length > 0 ? (
                <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                  {domains.map((domain, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center px-4 py-3 text-sm text-gray-700"
                    >
                      <span>{domain.domain}</span>
                      <button
                        onClick={() => handleDelete(domain.domain, domain.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No verified provider domains found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
