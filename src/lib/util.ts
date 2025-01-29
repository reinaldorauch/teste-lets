import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AssertionError } from "node:assert";
import { ParseError } from "./parse.error.js";

const makeResponseForErr = (statusCode: number, { message }: Error): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify({ message })
})

export const handleAssertions = (fn: (e: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>) =>
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      return await fn(event);
    } catch (err) {
      if (err instanceof AssertionError) {
        return makeResponseForErr(400, err);
      }

      if (err instanceof ParseError) {
        return makeResponseForErr(422, err);
      }

      throw err;
    }
  }
