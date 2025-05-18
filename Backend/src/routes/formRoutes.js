import express from "express";
import { receiveFormData } from "../controllers/formController.js";
import { protect } from "../middleware/authenticate.js";
import {
  acceptOffer,
  deleteItemByEntryId,
  editApplication,
  getAllEntryIds,
  getApplicationsForUser,
  getOfferForProvider,
  getOffersForUser,
  makeOffer,
  makeOfferMiddleware,
} from "../services/dynamoServices.js";
import { getSecrets } from "../utils/secrets.js";

const router = express.Router();
router.post("/receive-form-data", protect, receiveFormData);
router.get("/get-user-forms", protect, getApplicationsForUser);
router.post("/delete-user-entry", protect, deleteItemByEntryId);
router.get("/get-all-entries", protect, getAllEntryIds);
router.get("/get-user-offers", protect, getOffersForUser);
router.put("/accept-given-offer", protect, acceptOffer);
router.get("/test-sub-content", protect);
router.post("/make-offer", protect, makeOfferMiddleware, makeOffer);
router.get("/get-provider-offers", protect, getOfferForProvider);
router.put("/edit-application", protect, editApplication);

// Get all secrets
router.get("/get-secrets", protect, async (req, res) => {
  try {
    const secrets = await getSecrets();
    // Only return non-sensitive secrets
    const safeSecrets = {
      API_URL: secrets.API_URL,
      // Add other non-sensitive secrets here
    };
    res.json({ success: true, secrets: safeSecrets });
  } catch (error) {
    console.error("Error fetching secrets:", error);
    res.status(500).json({ success: false, error: "Failed to fetch secrets" });
  }
});

export default router;
