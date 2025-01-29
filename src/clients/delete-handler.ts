import { handleAssertions } from "@app/lib/util.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { strict as assert } from "node:assert";

const client = new DynamoDBClient({
  credentials: fromEnv(),
  endpoint: process.env.AWS_ENDPOINT_URL
});

const ddc = DynamoDBDocumentClient.from(client);

export const handler = handleAssertions(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  assert(event.httpMethod === 'DELETE', 'this function expects DELETE method');
  assert(event.pathParameters?.id, 'this function expects the {id} path param');

  await ddc.send(new DeleteCommand({ Key: { clientId: event.pathParameters.id }, TableName: 'clients' }));

  return {
    statusCode: 200,
    body: ''
  }
})

