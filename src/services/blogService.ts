import { DocumentClient } from '../lib/dynamodb'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { IBlogPost } from '../types'

const createBlog = async (blog: IBlogPost) => {
  await DocumentClient.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: blog,
    }),
  )
}

export { createBlog }
