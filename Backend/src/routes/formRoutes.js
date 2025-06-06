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
import dotenv from "dotenv"
dotenv.config()

const router = express.Router();
router.post("/receive-form-data", protect, receiveFormData);
router.get("/get-user-forms", protect, getApplicationsForUser);
router.post("/delete-user-entry", protect, deleteItemByEntryId);
router.post("/get-all-entries", protect, getAllEntryIds);
router.get("/get-user-offers", protect, getOffersForUser);
router.put("/accept-given-offer", protect, acceptOffer);
router.get("/test-sub-content", protect);
router.post("/make-offer", protect, makeOfferMiddleware, makeOffer);
router.get("/get-provider-offers", protect, getOfferForProvider);
router.put("/edit-application", protect, editApplication);



export default router;
