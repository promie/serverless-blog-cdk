import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Hello World',
      event: JSON.stringify(event),
    }),
  }
}
