import { util } from '@aws-appsync/utils';

/**
 * @param {import('@aws-appsync/utils').Context} ctx 
 */
export function request(ctx) {
  const {
    libId,
    title,
    userId,
    author,
    image,
  } = ctx.arguments.book;

  const now = util.time.nowISO8601();
  const bookId = `book#${now}`;

  const request = {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({ parId: libId, id: bookId }),
    attributeValues: util.dynamodb.toMapValues({
      title,
      userId,
      author,
      image,
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
