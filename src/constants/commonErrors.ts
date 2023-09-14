import { CustomError } from '../classes/CustomError'
import * as ERROR_MESSAGES from '../constants/error-messages'

import { statusCodes } from './statusCodes'

export const commonErrors = {
  emailTaken: new CustomError(ERROR_MESSAGES.EMAIL_TAKEN, statusCodes.conflict),
  invalidCredentials: new CustomError(
    ERROR_MESSAGES.INVALID_CREDENTIALS,
    statusCodes.unauthorized
  ),
  authFailed: new CustomError(
    ERROR_MESSAGES.AUTH_FAILED,
    statusCodes.unauthorized
  ),
  permissionDenied: new CustomError(
    ERROR_MESSAGES.PERMISSION_DENIED,
    statusCodes.unauthorized
  ),
  invalidMongoId: new CustomError(
    ERROR_MESSAGES.INVALID_MONGO_ID,
    statusCodes.badRequest
  ),
  newsNotFound: new CustomError(
    ERROR_MESSAGES.NEWS_NOT_FOUND,
    statusCodes.notFound
  ),
  commentNotFound: new CustomError(
    ERROR_MESSAGES.COMMENT_NOT_FOUND,
    statusCodes.notFound
  ),
  breakingNewsLimit: new CustomError(
    ERROR_MESSAGES.BREAKING_NEWS_LIMIT,
    statusCodes.badRequest
  ),
  noValuesProvided: new CustomError(
    ERROR_MESSAGES.NO_VALUES_PROVIDED,
    statusCodes.badRequest
  ),
  newsApi: new CustomError(ERROR_MESSAGES.NEWS_API_ERROR, statusCodes.internal),
  noImage: new CustomError(ERROR_MESSAGES.NO_IMAGE, statusCodes.badRequest),
}
