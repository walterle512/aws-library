import { util } from '@aws-appsync/utils';

/**
 * @param {import('@aws-appsync/utils').Context} ctx 
 */
export function request(ctx) {
  const {
    name,
    userId,
  } = ctx.arguments.library ?? ctx.args;

  const partitionId = `${userId}#user`;
  const now = util.time.nowISO8601();
  const libraryId = `${now}#library`;

  const request = {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({ parId: partitionId, id: libraryId }),
    attributeValues: util.dynamodb.toMapValues({
      name,
      userId,
      createdAt: now,
      updatedAt: now,
    }),
  };

  return request;
}

/**
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the DynamoDB items
 */
export function response(ctx) {
  if (ctx.error) {
		return util.error(ctx.error.message, ctx.error.type);
	}

  return ctx.result;
}
