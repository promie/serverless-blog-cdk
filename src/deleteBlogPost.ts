import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteBlogPost } from './services/blogService'
import { defaultHeaders } from './utils/headers'

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters || {}

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing id' }),
    }
  }

  try {
    await deleteBlogPost(id)
    return {
      statusCode: 204,
      body: '',
      headers: defaultHeaders,
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}
