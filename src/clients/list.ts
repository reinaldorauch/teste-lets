import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"

const client = new DynamoDBClient();

/**
  * List clients, paginated and with serach in name
  *
  */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const listCommand = new ScanCommand({ TableName: 'clients', Limit: 10 });


    return {
      statusCode: 200,
      body: 'Hello world'
    }
  } catch (err) {

  }
}
