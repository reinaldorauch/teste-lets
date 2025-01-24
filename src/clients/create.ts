// import {} from "@aws-cli/client-dynamodb"
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: 'Hello world'
  }
}
