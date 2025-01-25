import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { fromEnv } from "@aws-sdk/credential-providers"; // ES6 import
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import { Client } from "./client.entity.js";
import { parseInteger } from "@app/lib/parse.js";

const client = new DynamoDBClient({
  credentials: fromEnv(),
  endpoint: process.env.AWS_ENDPOINT_URL
});

const defaultResponse = {
  headers: {
    'Content-Type': "application/json"
  }
};

/**
  * List clients, paginated and with serach in name
  *
  */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    let page = parseInteger(event.queryStringParameters?.page);
    let items = parseInteger(event.queryStringParameters?.items, 10);

    const listCommand = new ScanCommand({ TableName: 'clients', Limit: items });

    const result = await client.send(listCommand);

    const found = result.Count;
    const data = result.Items;

    return {
      ...defaultResponse,
      statusCode: 200,
      body: JSON.stringify({
        found,
        page,
        data
      }),
    }
  } catch (err) {
    return {
      ...defaultResponse,
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error: ' + (err?.message || err)
      })
    }
  }
}
