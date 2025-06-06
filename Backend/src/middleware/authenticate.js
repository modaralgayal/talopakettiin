import { auth as adminAuth } from "../config/firebaseConfig.js";
import { checkProvider } from "../services/dynamoServices.js";

export const protect = async (req, res, next) => {
  // console.log("Authenticating user with Firebase session cookie"); // For debugging
  console.log("Query parameters in protect middleware:", req.query);
  console.log("Body parameters in protect middleware:", req.body);

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
    req.user = {
      uid: decodedClaims.uid, // Or decodedClaims.sub
      email: decodedClaims.email,
      ...decodedClaims,
    };

    // Check user type based on cookie, but verify provider status from DB
    const userTypeFromCookie = req.cookies.userType || null;

    if (userTypeFromCookie === "provider" && req.user.email) {
      const isVerifiedProvider = await checkProvider(req.user.email);
      if (isVerifiedProvider) {
        req.user.userType = "provider";
      } else {
        // If cookie says provider but DB doesn't verify, treat as unauthenticated or default
        req.user.userType = null; // Or a default type like 'customer' if appropriate
        // Optionally clear the invalid provider cookie
        res.clearCookie("userType");
      }
    } else {
      // For other user types (e.g., admin) or if cookie is not 'provider', use the cookie value
      // or a default. Ideally, admin status would also be verified against the DB/claims.
      // For now, stick to the existing logic for non-provider types.
      req.user.userType = userTypeFromCookie;
      if (!req.user.userType && decodedClaims.userType) {
        // Attempt to get it if it was a custom claim (example)
        req.user.userType = decodedClaims.userType;
      }
    }

    // console.log("Firebase session cookie verified. User:", req.user); // For debugging

    next();
  } catch (error) {
    // Session cookie is invalid, expired, or revoked.
    console.error("Error verifying Firebase session cookie:", error);
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
    if (req.user.userType && req.user.userType === userTypeRequired) {
      next();
    } else {
      const message = `Forbidden: Access denied. Required user type: '${userTypeRequired}', but current user type is '${
        req.user.userType || "not defined"
      }'.`;
      res.status(403).json({ success: false, error: message });
    }
  };
};
