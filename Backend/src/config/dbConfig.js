import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

let dynamoDBClient = null;

export async function getDynamoDBClient() {
  if (dynamoDBClient) {
    return dynamoDBClient;
  }

  dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: provess.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  return dynamoDBClient;
}
