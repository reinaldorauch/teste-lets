import { strict as assert } from "node:assert";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Client } from "./entity/client.entity.js";
import { handleAssertions } from "@app/lib/util.js";

const db = new DynamoDBClient({
  credentials: fromEnv(),
  endpoint: process.env.AWS_ENDPOINT_URL
})

const ddb = DynamoDBDocumentClient.from(db);

export const handler = handleAssertions(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  assert(event.httpMethod === 'GET', 'this function expects GET requests');
  assert(event.pathParameters && event.pathParameters.id && event.pathParameters.id.length > 0, 'this function expects an id pathParam');

  const res = await ddb.send(new GetCommand({
    Key: { clientId: event.pathParameters.id },
    TableName: 'clients'
  }));

  if (!res || !res.Item) {
    return {
      statusCode: 404,
      body: ''
    };
  }

  const client = Client.parseFromJson(res.Item);

  return {
    statusCode: 200,
    body: JSON.stringify(client),
    headers: {
      'content-type': 'application/json'
    }
  }
})
