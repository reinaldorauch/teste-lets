import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { fromEnv } from "@aws-sdk/credential-providers"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Client } from "./entity/client.entity.js";
import { handleAssertions } from "@app/lib/util.js";
import { strict as assert, AssertionError } from "node:assert";

const db = new DynamoDBClient({
  credentials: fromEnv(),
  endpoint: process.env.AWS_ENDPOINT_URL
});

const docDb = DynamoDBDocumentClient.from(db, { marshallOptions: { convertClassInstanceToMap: true } })

export const handler = handleAssertions(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  assert(event.httpMethod === 'POST', 'this function only allows POST requests');
  assert(event.body, 'this function should have a body');
  assert(event.headers && event.headers['content-type'] === 'application/json', 'this function expects a JSON body');

  let data: Record<string, unknown>;

  try {
    data = JSON.parse(event.body);
  } catch (err) {
    throw new AssertionError({ message: 'invalid json body:' + err.message });
  }

  const client = Client.createFromJson(data);

  await docDb.send(new PutCommand({ TableName: 'clients', Item: client }));

  return {
    statusCode: 201,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(client)
  }
});

