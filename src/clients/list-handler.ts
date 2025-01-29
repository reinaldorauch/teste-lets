import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { fromEnv } from "@aws-sdk/credential-providers"; // ES6 import
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Client } from "./entity/client.entity.js";
import { strict as assert } from "node:assert";
import { handleAssertions } from "@app/lib/util.js";

const client = new DynamoDBClient({
  credentials: fromEnv(),
  endpoint: process.env.AWS_ENDPOINT_URL
});

const docClient = DynamoDBDocumentClient.from(client);

const defaultResponse = {
  headers: {
    'Content-Type': "application/json"
  }
};

/**
  * List clients, paginated and with serach in name
  * TODO: Implement pagination or streaming of results because Dynamodb returns a maximum of 1MB per ScanCommand
  */
export const handler = handleAssertions(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  assert(event.httpMethod === 'GET', 'this function expects HTTP GET method');

  const listCommand = new ScanCommand({ TableName: 'clients' });

  const result = await docClient.send(listCommand);

  if (!result || !result.Items) {
    return {
      ...defaultResponse,
      statusCode: 200,
      body: JSON.stringify({
        found: 0,
        clients: []
      })
    }
  }

  const found = result.Count;
  const clients = result.Items.map(i => {
    const c = Client.parseFromJson(i);
    c.clientId = i.clientId;
    return c;
  });

  return {
    ...defaultResponse,
    statusCode: 200,
    body: JSON.stringify({
      found,
      clients
    }),
  }
});
