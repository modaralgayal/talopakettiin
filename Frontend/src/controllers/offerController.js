import { makeOfferToUser } from "./formController";

export const sendOffer = async (offerData, pdfFile = null) => {
  try {
    console.log("Offering this: ", offerData)
    console.log("Customer email: ", offerData.customerEmail)
    console.log("Entry ID: ", offerData.entryId) 
    const response = await makeOfferToUser(
      offerData,
      offerData.customerEmail,
      offerData.entryId,
      pdfFile
    );
    
    if (!response.success) {
      throw new Error(response.message || "Tarjouksen lähetys epäonnistui");
    }
    
    return response;
  } catch (error) {
    console.error("Error sending offer:", error);
    throw new Error("Tarjouksen lähetys epäonnistui. Yritä uudelleen myöhemmin.");
  }
}; 