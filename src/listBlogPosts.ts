import { APIGatewayProxyResult } from 'aws-lambda'
import { listBlogPosts } from './services/blogService'

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const blogPosts = await listBlogPosts()
    return {
      statusCode: 200,
      body: JSON.stringify(blogPosts),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
