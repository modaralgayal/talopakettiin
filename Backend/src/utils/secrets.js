import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { fromIni } from "@aws-sdk/credential-provider-ini";

const secretName = "talopakettiin";
const region = "eu-north-1";

// Set credentials explicitly from a specific profile (default)
const secretsManagerClient = new SecretsManagerClient({
  region,
  credentials: fromIni({ profile: "default" }), // Explicitly use the "default" profile
});

let cachedSecrets;

export async function getSecrets() {
  if (cachedSecrets) return cachedSecrets; // Return cached secrets if already fetched

  try {
    const response = await secretsManagerClient.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    if ("SecretString" in response) {
      cachedSecrets = JSON.parse(response.SecretString); // Cache and parse secrets
      return cachedSecrets;
    } else {
      throw new Error("SecretBinary is not supported.");
    }
  } catch (error) {
    console.error("Error fetching secrets from Secrets Manager:", error);
    throw error;
  }
}
// Recursively parse DynamoDB AttributeValue types
export const parseDynamoItem = (item) => {
  const parsed = {};
  for (const key in item) {
    parsed[key] = unwrapAttribute(item[key]);
  }
  return parsed;
};

const unwrapAttribute = (attr) => {
  if (attr.S !== undefined) {
    try {
      // Try parsing stringified JSON
      const parsed = JSON.parse(attr.S);
      return typeof parsed === "object" ? parsed : attr.S;
    } catch {
      return attr.S;
    }
  }
  if (attr.N !== undefined) return Number(attr.N);
  if (attr.BOOL !== undefined) return attr.BOOL;
  if (attr.M !== undefined) return parseDynamoItem(attr.M);
  if (attr.L !== undefined) return attr.L.map(unwrapAttribute);
  return null;
};
