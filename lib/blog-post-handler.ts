export const createBlogPostHandler = async () => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Hello World',
    }),
  }
}
