import { auth } from "../config/firebaseConfig.js";
import dotenv from "dotenv";
dotenv.config();

export const logOut = (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      domain:
        process.env.NODE_ENV === "production" ? ".talopakettiin.fi" : undefined,
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
      sameSite: "Lax",
      domain:
        process.env.NODE_ENV === "production" ? ".talopakettiin.fi" : undefined,
      path: "/",
    };
    res.cookie("session", sessionCookie, cookieOptions);

    // 5. Handle userType cookie (can be improved later)
    // For now, let's keep it, but ensure options are consistent
    res.cookie("userType", userType, cookieOptions);

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
