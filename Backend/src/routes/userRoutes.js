import express from "express";
import {
  firebaseSignIn,
  logOut,
  checkAdminStatus,
  addProviderDomain,
  addProviderEmail,
  getProvidersHelper,
  getDomainsHelper,
  checkProviderStatus,
  deleteProviderOrDomain,
} from "../controllers/userController.js";
import { protect } from "../middleware/authenticate.js";
import { deleteItemByEntryId } from "../services/dynamoServices.js";

const router = express.Router();

// Logout route
router.post("/logout", logOut);

// Sign in route
router.post("/firebaseSignIn", firebaseSignIn);

// Admin check route
router.post("/check-admin", checkAdminStatus);
router.post("/check-provider", checkProviderStatus);

router.post("/add-provider-domain", protect, addProviderDomain);
router.post("/add-provider-email", protect, addProviderEmail);

router.get("/get-all-providers", protect, getProvidersHelper);
router.get("/get-all-domain", protect, getDomainsHelper);

router.delete(
  "/delete-domain-or-provider",
  protect,
  deleteProviderOrDomain,
  deleteItemByEntryId
);

// Validate token route
router.post("/validate-token", protect, (req, res) => {
  res.status(200).json({
    success: true,
    userType: req.user.userType,
  });
});

export default router;
