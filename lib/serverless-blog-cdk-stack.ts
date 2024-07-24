import * as cdk from 'aws-cdk-lib'
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'

export class ServerlessBlogCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // API
    const blogsApi = new RestApi(this, 'blogPostApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    })

    const blogsResource = blogsApi.root.addResource('blogs')

    // Function
    const createBlogPostFunction = this.createLambda(
      'createBlogPost',
      'src/createBlogPost.ts',
    )
    blogsResource.addMethod(
      'POST',
      new LambdaIntegration(createBlogPostFunction),
    )
  }

  createLambda = (name: string, path: string) => {
    return new NodejsFunction(this, name, {
      functionName: name,
      runtime: Runtime.NODEJS_18_X,
      entry: path,
    })
  }
}
