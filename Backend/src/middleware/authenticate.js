import { auth as adminAuth } from "../config/firebaseConfig.js";

export const protect = async (req, res, next) => {
  // console.log("Authenticating user with Firebase session cookie"); // For debugging
  try {
    const sessionCookie = req.cookies.session || ""; // We named the cookie 'session'

    //console.log("Request body is: ", req.body);
    //console.log("Request cookies is: ", req.cookies);

    if (!sessionCookie) {
      console.log("Firebase session cookie not found in Backend");
      return res.status(401).json({
        success: false,
        error: "Unauthorized: No session cookie provided.",
      });
    }

    // Verify the session cookie.
    // The `true` second argument checks if the cookie has been revoked.
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true // Check for revocation
    );

    // Session cookie is valid.
    // decodedClaims will contain standard claims like 'sub' (user ID), 'email', etc.,
    // and any custom claims you might have added when creating the session cookie.
    // The UID is typically in `decodedClaims.sub` or `decodedClaims.uid`.
    // Firebase Admin SDK often maps `sub` to `uid` on the decoded object.
    req.user = {
      uid: decodedClaims.uid, // Or decodedClaims.sub
      email: decodedClaims.email,
      // Add other relevant claims you need from decodedClaims
      ...decodedClaims, // You can spread all claims if useful
    };

    // Continue to get userType from its own cookie for now
    // This should ideally be a custom claim in the session cookie or fetched from your DB
    req.user.userType = req.cookies.userType || null;
    if (!req.userType && req.user) {
      // Attempt to get it if it was a custom claim (example)
      req.userType = decodedClaims.userType || null;
    }
    // console.log("Firebase session cookie verified. User:", req.user, "UserType:", req.userType); // For debugging
    next();
  } catch (error) {
    // Session cookie is invalid, expired, or revoked.
    console.error("Error verifying Firebase session cookie:", error.message);
    let errorMessage =
      "Unauthorized: Invalid, expired, or revoked session. Please login again.";
    if (error.code === "auth/session-cookie-revoked") {
      errorMessage =
        "Unauthorized: Your session has been revoked. Please login again.";
    } else if (error.code === "auth/session-cookie-expired") {
      errorMessage =
        "Unauthorized: Your session has expired. Please login again.";
    }
    // Clear potentially invalid cookies on error
    res.clearCookie("session");
    res.clearCookie("userType");
    return res.status(401).json({ success: false, error: errorMessage });
  }
};

// Middleware to check for a specific user type AFTER `protect` has run
export const authorize = (userTypeRequired) => {
  return (req, res, next) => {
    if (!req.user) {
      // Should have been caught by protect, but good to double check
      return res
        .status(401)
        .json({ success: false, error: "User not authenticated." });
    }
    if (req.userType && req.userType === userTypeRequired) {
      next();
    } else {
      const message = `Forbidden: Access denied. Required user type: '${userTypeRequired}', but current user type is '${
        req.userType || "not defined"
      }'.`;
      res.status(403).json({ success: false, error: message });
    }
  };
};
