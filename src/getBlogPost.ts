import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getBlogPost } from './services/blogService'

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
    const blogPost = await getBlogPost(id)

    if (!blogPost) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Blog post not found' }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(blogPost),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    }
  }
}
