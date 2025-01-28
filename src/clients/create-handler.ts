import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { fromEnv } from "@aws-sdk/credential-providers"
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import { Client } from "./client.entity.js";

const db = new DynamoDBClient({
  credentials: fromEnv(),
  endpoint: process.env.AWS_ENDPOINT_URL
});

const docDb = DynamoDBDocumentClient.from(db)

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (event.httpMethod !== 'POST') {
      throw new Error('this function only allows POST requests');
    }

    if (!event.body || event.headers['Content-Type'] !== 'application/json') {
      throw new Error('this function expects a JSON body');
    }

    const client = Client.createFromJson(JSON.parse(event.body));

    await docDb.send(new PutCommand({ TableName: 'clients', Item: client }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client
      })
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: `InternalServerError: ${err.message}\n${err.stack}`
    }
  }
}
