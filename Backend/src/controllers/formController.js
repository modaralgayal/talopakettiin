import {
  addApplicationToUser,
  checkApplicationLimit,
} from "../services/dynamoServices.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

export const receiveFormData = async (req, res) => {
  console.log("Receiving...");
  try {
    const user = req.user;

    // Check if user is a customer
    if (user.userType !== "customer") {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        message: "Only customers can submit applications",
      });
    }

    //console.log("Request body:", req.body);

    // Initialize limitCheck with default values
    let limitCheck = {
      canSubmit: true,
      currentCount: 0,
      limit: 10,
    };

    // Check application limit for new applications using email instead of userId
    if (req.body.entryType !== "offer") {
      limitCheck = await checkApplicationLimit(user.email);
      if (!limitCheck.canSubmit) {
        return res.status(400).json({
          success: false,
          error: "Application limit reached",
          message: `You have reached the maximum limit of ${limitCheck.limit} applications. Please delete some applications before submitting new ones.`,
          currentCount: limitCheck.currentCount,
          limit: limitCheck.limit,
        });
      }
    }

    const entryType = req.body.entryType || "application";
    const offerId = req.body.offerId || null;

    // Generate new UUID for entryId
    const entryId = uuidv4();
    console.log("Generated entryId:", entryId);

    let applicationData = {
      email: user.email,
      customerEmail: user.email,
      name: user.name || user.email.split("@")[0],
      userType: user.userType,
      formData: req.body,
      entryId: String(entryId),
      timestamp: new Date().toISOString(),
      status: entryType === "offer" ? "pending" : "applied - pending",
      entryType,
    };

    if (entryType === "offer" && offerId) {
      applicationData.offerId = offerId;
    }

    console.log("applicationData to save:", applicationData);

    await addApplicationToUser(applicationData);

    // Send confirmation email
    try {

      const transporter = nodemailer.createTransport({
        host: "mail.smtp2go.com",
        port: 587,
        secure: false,
        auth: {
          user: "talopakettiin.fi",
          pass: process.env.EMAIL_PASS,
        },
      });

      // Try to get application name from formData or fallback
      const applicationName =
        req.body.applicationName ||
        req.body.formData?.applicationName ||
        req.body.name ||
        "your application";

      const mailOptions = {
        from: "info@talopakettiin.fi",
        to: user.email,
        subject: "Application Submitted Successfully",
        text: `Hei!\n
        \n Hakemuksesi \"${applicationName}\" on vastaanotettu!\n
        \n Kiitos,
        \nTalopakettiin.fi tiimi`,
      };

      await transporter.sendMail(mailOptions);
      console.log("Confirmation email sent to", user.email);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Optionally, you can still return success even if email fails
    }

    res.status(200).json({
      success: true,
      message: "Form data saved successfully!",
      entryId,
      currentCount: limitCheck.currentCount + 1,
      limit: limitCheck.limit,
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({
      error: "An error occurred while saving the form data.",
    });
  }
};
