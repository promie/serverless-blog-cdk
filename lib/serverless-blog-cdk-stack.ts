import * as cdk from 'aws-cdk-lib'
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
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

    const deleteBlogPostFunction = this.createLambda(
      'deleteBlogPost',
      'src/deleteBlogPost.ts',
      blogsTable,
    )
    blogsTable.grantWriteData(deleteBlogPostFunction)
    specificBlogResource.addMethod(
      'DELETE',
      new LambdaIntegration(deleteBlogPostFunction),
    )

    // Lambda function for API Docs
    const apiDocsFunction = new NodejsFunction(this, 'apiDocs', {
      functionName: 'apiDocs',
      runtime: Runtime.NODEJS_18_X,
      entry: 'src/apiDocs.ts',
      environment: { API_ID: blogsApi.restApiId },
    })

    // Define the policy for the API Docs function
    const policy = new PolicyStatement({
      actions: ['api-gateway:GET'],
      resources: ['*'],
    })
    apiDocsFunction.role?.addToPrincipalPolicy(policy)

    // Define the API Docs resource
    const apiDocsResource = blogsApi.root.addResource('api-docs')
    apiDocsResource.addMethod('GET', new LambdaIntegration(apiDocsFunction))
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
