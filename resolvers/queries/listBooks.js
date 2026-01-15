/**
 * @param {import('@aws-appsync/utils').Context} ctx 
 */
export function request(ctx) {
  const { parId, nextToken } = ctx.arguments;
  const request = {
    operation: 'Query',
    query: {
      expression: '#parId = :parId',
      expressionNames: {
        '#parId': 'parId',
      },
      expressionValues: util.dynamodb.toMapValues({ ':parId': parId }),
    },
    limit: 10,
  };

  if (nextToken) {
    request.nextToken = nextToken;
  }

  return request;
}

/**
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the DynamoDB items
 */
export function response(ctx) {
  return {
    items: ctx.result.items ?? [],
    nextToken: ctx.result.nextToken ?? null,
  }
}
