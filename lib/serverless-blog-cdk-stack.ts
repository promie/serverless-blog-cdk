import * as cdk from 'aws-cdk-lib'
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'

export class ServerlessBlogCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Dynamo DB table
    const blogsTable = new Table(this, 'Blogs', {
      tableName: 'Blogs',
      partitionKey: { name: 'id', type: AttributeType.STRING },
    })

    // API
    const blogsApi = new RestApi(this, 'blogPostApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    })

    const blogsResource = blogsApi.root.addResource('blogs')
    const specificBlogResource = blogsResource.addResource('{id}')

    // Function
    const createBlogPostFunction = this.createLambda(
      'createBlogPost',
      'src/createBlogPost.ts',
      blogsTable,
    )
    blogsTable.grantWriteData(createBlogPostFunction)
    blogsResource.addMethod(
      'POST',
      new LambdaIntegration(createBlogPostFunction),
    )

    const listBlogPostsFunction = this.createLambda(
      'listBlogPosts',
      'src/listBlogPosts.ts',
      blogsTable,
    )
    blogsTable.grantReadData(listBlogPostsFunction)
    blogsResource.addMethod('GET', new LambdaIntegration(listBlogPostsFunction))

    const getBlogPostFunction = this.createLambda(
      'getBlogPost',
      'src/getBlogPost.ts',
      blogsTable,
    )
    blogsTable.grantReadData(getBlogPostFunction)
    specificBlogResource.addMethod(
      'GET',
      new LambdaIntegration(getBlogPostFunction),
    )
  }

  createLambda = (name: string, path: string, table: Table) => {
    return new NodejsFunction(this, name, {
      functionName: name,
      runtime: Runtime.NODEJS_18_X,
      entry: path,
      environment: { TABLE_NAME: table.tableName },
    })
  }
}
