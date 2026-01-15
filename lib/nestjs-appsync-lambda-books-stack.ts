import { AuthorizationType, Definition, FunctionRuntime, GraphqlApi, Code } from 'aws-cdk-lib/aws-appsync';
import { TableV2, AttributeType, Billing } from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib/core';

import { Construct } from 'constructs';
import path from 'path';
import { MUTATION_RESOVLERS, QUERY_RESOVLERS } from './resolvers';

export class NestjsAppsyncLambdaBooksStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new TableV2(this, 'MyTable', {
      partitionKey: { 
        name: 'parId', 
        type: AttributeType.STRING 
      },
      sortKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'LibraryBookTable',
      billing: Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const graphqlApi = new GraphqlApi(this, 'GraphQLApi', {
      name: 'BooksApi',
      definition: Definition.fromFile(path.join(__dirname, './graphql/schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        }
      },
      xrayEnabled: true,
    });

    const datasource = graphqlApi.addDynamoDbDataSource('BookDynamodbDataSource', table);
    
    const resolvers = [...QUERY_RESOVLERS, ...MUTATION_RESOVLERS];
    for (const { id, typeName, fieldName, pathName } of resolvers) {
      datasource.createResolver(id, {
        typeName,
        fieldName,
        runtime: FunctionRuntime.JS_1_0_0,
        code: Code.fromAsset(path.join(__dirname, pathName)),
      })
    }
  }
}
