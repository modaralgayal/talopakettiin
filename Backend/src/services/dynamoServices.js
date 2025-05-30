import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
  QueryCommand,
  DeleteItemCommand,
  PutItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

import nodemailer from "nodemailer";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { configDotenv } from "dotenv";

configDotenv()

const APPLICATION_LIMIT = 10;

const initDynamoDBClient = async () => {
  return new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

export const scanTable = async () => {
  const client = await initDynamoDBClient();
  const params = { TableName: "talopakettiin" };
  const data = await client.send(new ScanCommand(params));
  return data.Items.map((item) => unmarshall(item));
};

export const addItemToTable = async (item) => {
  const client = await initDynamoDBClient();
  const params = {
    TableName: "talopakettiin",
    Item: marshall(item),
  };
  await client.send(new PutItemCommand(params));
};

export const addApplicationToUser = async (item) => {
  const client = await initDynamoDBClient();
  const id = uuidv4();

  console.log("Adding to DynamoDB:", item);

  const params = {
    TableName: "Talopakettiin-API",
    Item: marshall({ ...item, id }),
  };

  try {
    await client.send(new PutItemCommand(params));
    console.log("Form ID successfully logged in DynamoDB.");
  } catch (error) {
    console.error("Error adding Form ID to DynamoDB:", error);
  }
};

export const getApplicationsForUser = async (req, res) => {
  if (req.user.userType !== "customer") {
    return res
      .status(403)
      .json({ error: "Access denied: User is not a customer" });
  }

  try {
    const client = await initDynamoDBClient();
    const email = req.user.email;

    const params = {
      TableName: "Talopakettiin-API",
      FilterExpression: "email = :email",
      ExpressionAttributeValues: marshall({
        ":email": email,
      }),
    };

    const command = new ScanCommand(params);
    const response = await client.send(command);

    const applications = response.Items
      ? response.Items.map((item) => unmarshall(item))
      : [];

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

export const getAllEntryIds = async (req, res) => {
  try {
    if (req.user.userType !== "provider") {
      return res
        .status(403)
        .json({ error: "Access denied: User is not a provider" });
    }

    console.log("got here");
    const client = await initDynamoDBClient();

    const params = {
      TableName: "Talopakettiin-API",
      FilterExpression: "#entryType = :entryTypeVal",
      ExpressionAttributeNames: {
        "#entryType": "entryType",
      },
      ExpressionAttributeValues: {
        ":entryTypeVal": { S: "application" },
      },
    };

    const command = new ScanCommand(params);
    const data = await client.send(command);
    // console.log("This is the data", data);

    const result = data.Items.map((item) => {
      const parsedItem = {};
      for (const key in item) {
        parsedItem[key] = Object.values(item[key])[0];
      }
      return parsedItem;
    });

    console.log("Fetched entries:", result);

    res.status(200).json({ entries: result });
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};

export const getOffersForUser = async (req, res) => {
  if (req.user.userType !== "customer") {
    return res
      .status(403)
      .json({ error: "Access denied: User is not a customer" });
  }

  try {
    const userEmail = req.user.email;
    const client = await initDynamoDBClient();

    // Query offers directly using customerEmail and entryType
    const params = {
      TableName: "Talopakettiin-API",
      FilterExpression:
        "entryType = :entryType AND customerEmail = :customerEmail",
      ExpressionAttributeValues: {
        ":entryType": { S: "offer" },
        ":customerEmail": { S: userEmail },
      },
    };

    const command = new ScanCommand(params);
    const data = await client.send(command);

    // Map and unmarshall the offers
    const offers = data.Items ? data.Items.map((item) => unmarshall(item)) : [];

    // Optional: Sort offers by timestamp in descending order (newest first)
    const sortedOffers = offers.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.status(200).json({
      success: true,
      data: { offers: sortedOffers },
    });
  } catch (error) {
    console.error("Error fetching offers for user:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};

export const getOfferForProvider = async (req, res) => {
  if (req.user.userType !== "provider") {
    return res
      .status(403)
      .json({ error: "Access denied: User is not a customer" });
  }

  try {
    const providerEmail = req.user.email;
    const client = await initDynamoDBClient();

    const params = {
      TableName: "Talopakettiin-API",
      FilterExpression:
        "entryType = :entryType AND providerEmail = :providerEmail",
      ExpressionAttributeValues: {
        ":entryType": { S: "offer" },
        ":providerEmail": { S: providerEmail },
      },
    };

    const command = new ScanCommand(params);
    const data = await client.send(command);

    const offers = data.Items ? data.Items.map((item) => unmarshall(item)) : [];

    const sortedOffers = offers.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.status(200).json({
      success: true,
      data: { offers: sortedOffers },
    });
  } catch (error) {
    console.error("Error fetching offers for user:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};

export const deleteItemByEntryId = async (req, res) => {
  if (req.user.userType !== "customer") {
    return res
      .status(403)
      .json({ error: "Access denied: User is not a customer" });
  }
  console.log("req.body: ", req.body);
  const idToDelete = req.body.entryId;
  console.log("Attempting to delete item with id: ", idToDelete);

  if (!idToDelete) {
    return res.status(400).json({ error: "No id provided" });
  }

  const client = await initDynamoDBClient();

  const deleteParams = {
    TableName: "Talopakettiin-API",
    Key: {
      id: { S: idToDelete },
    },
  };

  try {
    await client.send(new DeleteItemCommand(deleteParams));
    console.log(`Successfully deleted item with id: ${idToDelete}`);
    res.status(200).json({
      message: `Successfully deleted item with id: ${idToDelete}`,
    });
  } catch (error) {
    console.error(`Error deleting item with id: ${idToDelete}`, error);
    res.status(500).json({
      error: `Failed to delete item with id: ${idToDelete}`,
    });
  }
};

export const acceptOffer = async (req, res) => {
  if (req.user.userType !== "customer") {
    return res
      .status(403)
      .json({ error: "Access denied: User is not a customer" });
  }

  try {
    const dynamoDBClient = await initDynamoDBClient();
    const { id, entryId } = req.body;
    const secrets = await getSecrets();

    console.log("Request Body:", req.body);

    if (!id || !entryId) {
      throw new Error("Missing 'id' or 'entryId' in request body.");
    }

    // Step 1: Fetch the offer to get provider's email
    console.log("Fetching offer details");
    const getOfferParams = {
      TableName: "Talopakettiin-API",
      Key: { id: { S: id } },
    };

    const offerResult = await dynamoDBClient.send(
      new GetItemCommand(getOfferParams)
    );
    if (!offerResult.Item) {
      throw new Error("Offer not found");
    }

    const offer = unmarshall(offerResult.Item);
    const emailAddress = offer.providerEmail;

    console.log("Email fetched: ", emailAddress);

    if (!emailAddress) {
      throw new Error("Provider email not found in offer.");
    }

    // Step 2: Update Offer Status to "Accepted"
    const offerUpdateParams = {
      TableName: "Talopakettiin-API",
      Key: { id: { S: id } },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": { S: "Accepted" } },
      ReturnValues: "ALL_NEW",
    };

    console.log("Updating Offer:", offerUpdateParams);
    await dynamoDBClient.send(new UpdateItemCommand(offerUpdateParams));

    // Step 3: Query Applications using entryType-entryId GSI
    const queryParams = {
      TableName: "Talopakettiin-API",
      IndexName: "entryType-entryId-index",
      KeyConditionExpression: "entryType = :entryType AND entryId = :entryId",
      ExpressionAttributeValues: {
        ":entryType": { S: "application" },
        ":entryId": { S: entryId },
      },
    };

    console.log("Querying Applications:", queryParams);
    const queryResult = await dynamoDBClient.send(
      new QueryCommand(queryParams)
    );
    const applications = queryResult.Items || [];

    console.log("Applications Found:", applications.length);

    // Step 4: Batch Update Application Statuses
    for (const app of applications) {
      const updateParams = {
        TableName: "Talopakettiin-API",
        Key: { id: { S: app.id.S } },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": { S: "Accepted" } },
      };

      console.log("Updating Application:", updateParams);
      await dynamoDBClient.send(new UpdateItemCommand(updateParams));
    }

    // Step 5: Send Email Notification
    const transporter = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 587,
      secure: false,
      auth: {
        user: "talopakettiin.fi",
        pass: secrets.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "info@talopakettiin.fi",
      to: emailAddress,
      subject: "Offer Accepted Notification",
      text: `Hello,

      The offer with ID ${id} has been accepted. All related applications have been updated accordingly.

      Thank you,
      Talopakettiin Team`,
    };

    console.log("Sending Email:", mailOptions);
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Offer accepted, applications updated, and email sent.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process the request.",
      error: error.message,
    });
  }
};

const storage = multer.memoryStorage(); // Store in memory; can change to disk
const upload = multer({ storage });

export const makeOfferMiddleware = upload.single("pdfFile"); // handles multipart/form-data with one file field: pdfFile

export const makeOffer = async (req, res) => {
  try {
    if (req.user.userType !== "provider") {
      return res
        .status(403)
        .json({ error: "Access denied: User is not a provider" });
    }

    const { offerData, customerEmail, entryId } = req.body;
    const providerEmail = req.user.email;
    const providerName = req.user.name;

    if (!offerData || !customerEmail || !entryId) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    // Parse offerData string back to object
    let parsedOfferData;
    try {
      parsedOfferData = JSON.parse(offerData);
    } catch (err) {
      return res.status(400).json({ error: "Invalid offerData format." });
    }

    // Attach file buffer if present
    if (req.file) {
      parsedOfferData.pdfFile = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer.toString("base64"), // Base64 encoding for safe storage
      };
    }

    const offerId = uuidv4();
    const offerItem = {
      id: offerId,
      offerData: parsedOfferData,
      customerEmail,
      providerEmail,
      providerName,
      entryId,
      entryType: "offer",
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    const client = await initDynamoDBClient();

    const params = {
      TableName: "Talopakettiin-API",
      Item: marshall(offerItem),
    };

    await client.send(new PutItemCommand(params));

    // Send email notification to customer
    const secrets = await getSecrets();
    const transporter = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 587,
      secure: false,
      auth: {
        user: "talopakettiin.fi",
        pass: secrets.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "info@talopakettiin.fi",
      to: customerEmail,
      subject: "New Offer Received",
      text: `Hello,

      You have received a new offer from ${providerName}.

      Please log in to your Talopakettiin account to view the offer details.

      Thank you,
      Talopakettiin Team`,
    };

    console.log("Sending offer notification email to customer");
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Offer sent successfully" });
  } catch (error) {
    console.error("Error sending offer:", error);
    res.status(500).json({ error: "Failed to send offer" });
  }
};

export const checkApplicationLimit = async (email) => {
  const client = await initDynamoDBClient();
  const params = {
    TableName: "Talopakettiin-API",
    FilterExpression: "email = :email AND entryType = :type",
    ExpressionAttributeValues: marshall({
      ":email": email,
      ":type": "application",
    }),
  };

  try {
    const command = new ScanCommand(params);
    const response = await client.send(command);
    const currentCount = response.Items ? response.Items.length : 0;

    return {
      canSubmit: currentCount < APPLICATION_LIMIT,
      currentCount,
      limit: APPLICATION_LIMIT,
    };
  } catch (error) {
    console.error("Error checking application limit:", error);
    throw error;
  }
};

export const editApplication = async (req, res) => {
  try {
    const id = req.body.id;
    const formData = req.body.formData;
    const user = req.user;
    const client = await initDynamoDBClient();
    console.log(`Sending: ${id} and ${JSON.stringify(formData, null, 2)}`);
    const params = {
      TableName: "Talopakettiin-API",
      Key: {
        id: { S: id },
      },
      UpdateExpression: "SET formData = :formData",
      ExpressionAttributeValues: {
        ":formData": { M: marshall(formData) },
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await client.send(new UpdateItemCommand(params));

    try {
      const secrets = await getSecrets();
      const transporter = nodemailer.createTransport({
        host: "mail.smtp2go.com",
        port: 587,
        secure: false,
        auth: {
          user: "talopakettiin.fi",
          pass: secrets.EMAIL_PASS,
        },
      });

      // Try to get application name from formData or fallback
      const applicationName =
        req.body.formData?.applicationName || "your application";

      const mailOptions = {
        from: "info@talopakettiin.fi",
        to: user.email,
        subject: "Application Edited Successfully",
        text: `Hello,\n\nYour application \"${applicationName}\" has been updated successfully.\n\nThank you,\nTalopakettiin Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log("Confirmation email sent to", user.email);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Optionally, you can still return success even if email fails
    }

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      updatedItem: result.Attributes,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
};
