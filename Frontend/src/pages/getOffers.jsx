import React, { useEffect, useState } from "react";
import { getOffersForUser, acceptOffer } from "../controllers/formController";

const GetOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOffersForUser()
      .then((res) => {
        console.log("This is the response: ", res);
        setOffers(res.data?.offers || []);
      })
      .catch((err) => {
        setError(err?.error || "Failed to fetch offers");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleViewPdf = (pdfFile) => {
    console.log("pdfFile type:", typeof pdfFile, pdfFile);

    if (pdfFile && pdfFile.buffer) {
      const base64Pdf = pdfFile.buffer;
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

  const handleAcceptOffer = async (entryId, id, emailAddress) => {
    console.log("Offer accepted:", entryId, id, emailAddress);

    try {
      const result = await acceptOffer(id, entryId, emailAddress);
      alert(result.message);

      // Update the offer status locally in the UI
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === id ? { ...offer, status: "Accepted" } : offer
        )
      );
    } catch (error) {
      alert("Failed to accept the offer. Please try again.");
      console.error("Error accepting offer:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading offers...</p>
      </div>
    );
  if (error)
    return <p className="text-red-600 text-center p-4">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Received Offers</h2>
      {offers.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No offers received yet.
        </p>
      ) : (
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {offer.offerData?.firmName}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Provider:</span>{" "}
                    {offer.offerData?.providerEmail}
                  </p>
                  <p className="text-gray-700">
                    {offer.offerData?.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {offer.offerData?.price} €
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Total price</div>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                {offer.offerData.pdfFile && (
                  <button
                    onClick={() => handleViewPdf(offer.offerData.pdfFile)}
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
                  <button
                    onClick={() =>
                      handleAcceptOffer(
                        offer.entryId,
                        offer.id,
                        offer.offerData?.providerEmail
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Accept Offer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetOffers;
