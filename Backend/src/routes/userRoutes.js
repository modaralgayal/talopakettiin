import express from "express";
import { firebaseGoogleSignIn, logOut } from "../controllers/userController.js";
import { protect } from "../middleware/authenticate.js";

const router = express.Router();

// Logout route
router.post("/logout", logOut);

router.post("/firebaseGoogleSignIn", firebaseGoogleSignIn);

// Validate token route
router.post("/validate-token", protect, (req, res) => {
  res.status(200).json({
    success: true,
    userType: req.user.userType,
  });
});

export default router;
