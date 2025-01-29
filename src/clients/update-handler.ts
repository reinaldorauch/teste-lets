import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { strict as assert, AssertionError } from "node:assert";
import { Client } from "./entity/client.entity.js";
import { handleAssertions } from "@app/lib/util.js";

const client = new DynamoDBClient({
  credentials: fromEnv(),
  endpoint: process.env.AWS_ENDPOINT_URL
});

const ddc = DynamoDBDocumentClient.from(client, { marshallOptions: { convertClassInstanceToMap: true } });

export const handler = handleAssertions(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  assert(event.httpMethod === 'PUT', 'this function expects PUT method');
  assert(event.pathParameters?.id, 'this function expects the {id} path param');
  assert(event.body, 'this function expects a body');
  assert(event.headers && event.headers['content-type'] === 'application/json', 'this function expects the body to be a JSON');

  let data: Record<string, unknown>;

  try {
    data = JSON.parse(event.body);
  } catch (err) {
    throw new AssertionError({ message: 'Invalid JSON body: ' + err.message });
  }

  const updatedClient = Client.parseFromJson(data);

  await ddc.send(new UpdateCommand({
    Key: { clientId: event.pathParameters.id },
    TableName: 'clients',
    // Using this because the original type borks with the Client type
    AttributeUpdates: updatedClient as unknown as Record<string, unknown>
  }));

  return {
    statusCode: 200,
    body: ''
  }
});

