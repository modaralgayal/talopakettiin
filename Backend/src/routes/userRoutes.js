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
} from "../controllers/userController.js";
import { protect } from "../middleware/authenticate.js";

const router = express.Router();

// Logout route
router.post("/logout", logOut);

// Sign in route
router.post("/firebaseSignIn", firebaseSignIn);

// Admin check route
router.post("/check-admin", checkAdminStatus);
router.post("/check-provider", checkProviderStatus);

router.post("/add-provider-domain", addProviderDomain);
router.post("/add-provider-email", addProviderEmail);

router.get("/get-all-providers", protect, getProvidersHelper);
router.get("/get-all-domain", protect, getDomainsHelper);

// Validate token route
router.post("/validate-token", protect, (req, res) => {
  res.status(200).json({
    success: true,
    userType: req.user.userType,
  });
});

export default router;
