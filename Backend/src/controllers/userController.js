import { auth } from "../config/firebaseConfig.js";
import {
  addVerifiedProviderDomain,
  addVerifiedProviderEmail,
  isAdminUser,
  getAllAdminUsers,
  verifyProviderEmail,
  getAllProviders,
  getAllDomains,
  checkProvider,
  deleteItemByEntryId,
} from "../services/dynamoServices.js";
import dotenv from "dotenv";
dotenv.config();

export const logOut = (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    // Clear the session cookie
    res.clearCookie("session", cookieOptions);

    // Clear the userType cookie
    res.clearCookie("userType", cookieOptions);

    // For true session invalidation with Firebase session cookies,
    // you would typically get the session cookie, verify it, get the uid (sub claim),
    // and then call admin.auth().revokeRefreshTokens(uid).
    // This makes the logout endpoint require the session to be valid to revoke it.
    // For now, just clearing the cookie on the client side.

    res.status(200).json({
      success: true,
      message: "Logged out successfully. Cookies cleared.",
    });
  } catch (error) {
    console.error("Error in logout:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Error during logout" });
    }
  }
};

export const firebaseSignIn = async (req, res) => {
  // 1. Make async
  try {
    const idToken = req.body.token; // Renamed for clarity to match client
    const userType = req.body.userType;
    if (!idToken) {
      return res
        .status(400)
        .json({ success: false, error: "ID token is required." });
    }
    if (!userType) {
      return res
        .status(400)
        .json({ success: false, error: "User type is required." });
    }

    let decodedIdToken;
    try {
      // 2. Correctly await verifyIdToken
      decodedIdToken = await auth.verifyIdToken(idToken);
    } catch (verifyError) {
      console.error("Error verifying Firebase ID token:", verifyError);
      return res.status(401).json({
        success: false,
        error: "Invalid or expired ID token. Please sign in again.",
      });
    }

    // 3. Create a Firebase session cookie
    const expiresIn = 3 * 60 * 60 * 1000; // 3 hours session
    let sessionCookie;
    try {
      sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    } catch (sessionError) {
      console.error("Error creating session cookie:", sessionError);
      return res
        .status(500)
        .json({ success: false, error: "Failed to create session." });
    }

    // 4. Set the session cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      sameSite: "lax",
      path: "/",
    };
    res.cookie("session", sessionCookie, cookieOptions);

    // 5. Handle userType cookie
    const userTypeCookieOptions = {
      ...cookieOptions,
    };
    res.cookie("userType", userType, userTypeCookieOptions);

    res.status(200).json({
      success: true,
      message: "User signed in successfully and session established.",
      // Optionally, you can send back some user info from decodedIdToken if needed by the client immediately
      // user: { uid: decodedIdToken.uid, email: decodedIdToken.email }
    });
  } catch (error) {
    console.error("Error in firebaseGoogleSignIn:", error);
    // Ensure a JSON response for all error paths if client expects it
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Internal server error during sign-in.",
      });
    }
  }
};

// Verify provider email during sign in
export const verifyProviderSignIn = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const isVerified = await verifyProviderEmail(email);

    if (!isVerified) {
      return res.status(403).json({
        success: false,
        error: "This email is not from a verified provider domain",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Provider email verified",
    });
  } catch (error) {
    console.error("Error verifying provider:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Admin endpoint to add verified provider domain
export const addProviderDomain = async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: "Domain is required",
      });
    }

    const success = await addVerifiedProviderDomain(domain);

    if (!success) {
      return res.status(500).json({
        success: false,
        error: "Failed to add verified domain",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Domain added successfully",
    });
  } catch (error) {
    console.error("Error adding provider domain:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Admin endpoint to add verified provider email
export const addProviderEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const success = await addVerifiedProviderEmail(email);

    if (!success) {
      return res.status(500).json({
        success: false,
        error: "Failed to add verified email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email added successfully",
    });
  } catch (error) {
    console.error("Error adding provider email:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Admin management endpoints
export const checkAdminStatus = async (req, res) => {
  console.log("req.body.email", req.body.email);
  try {
    const email = req.body.email;
    console.log("Checking admin status for email:", email);
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const isAdmin = await isAdminUser(email);

    if (!isAdmin) {
      return res.status(400).json({
        success: false,
        isAdmin,
      });
    }

    return res.status(200).json({
      success: true,
      isAdmin,
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const admins = await getAllAdminUsers();

    return res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getProvidersHelper = async (req, res) => {
  try {
    const userType = req.user.userType;
    if (userType !== "admin") {
      return res.status(400).json({
        success: false,
        error: "User is not authorized to access authorized providers",
      });
    }

    const providerList = await getAllProviders();

    return res.status(200).json({
      success: true,
      providerList,
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getDomainsHelper = async (req, res) => {
  try {
    const userType = req.user.userType;
    if (userType !== "admin") {
      return res.status(400).json({
        success: false,
        error: "User is not authorized to access authorized domains",
      });
    }
    const domainList = await getAllDomains();

    return res.status(200).json({
      success: true,
      domainList,
    });
  } catch (error) {
    console.error("Error fetching domains:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Check provider status
export const checkProviderStatus = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const isProvider = await checkProvider(email);

    if (!isProvider) {
      return res.status(400).json({
        success: false,
        isProvider,
      });
    }

    return res.status(200).json({
      success: true,
      isProvider,
    });
  } catch (error) {
    console.error("Error checking provider status:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const deleteProviderOrDomain = async (req, res, next) => {
  try {
    console.log("Delete request body:", req.body);

    const userType = req.user.userType;
    console.log("User type:", userType);

    if (userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "User is not an admin, action is unauthorized",
      });
    }

    // If we get here, the user is an admin, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error in deleteProviderOrDomain middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Error in delete middleware: " + error.message,
    });
  }
};
