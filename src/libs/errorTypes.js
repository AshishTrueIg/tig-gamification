import { StatusCodes } from 'http-status-codes'

// common errors for all the backend services

export const RequestInputValidationErrorType = {
  name: 'RequestInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3001
}

export const ResponseValidationErrorType = {
  name: 'ResponseInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description: 'Response validation failed please refer json schema of response',
  errorCode: 3002
}

export const SocketRequestInputValidationErrorType = {
  name: 'SocketRequestInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3003
}

export const SocketResponseValidationErrorType = {
  name: 'SocketResponseValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description: 'Response validation of socket failed please refer json schema of response',
  errorCode: 3004
}

export const InternalServerErrorType = {
  name: 'InternalServerError',
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  isOperational: true,
  description: 'Internal Server Error',
  errorCode: 3005
}

export const InvalidSocketArgumentErrorType = {
  name: 'InvalidSocketArgumentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please provide, proper arguments eventName, [payloadObject], and [callback]',
  errorCode: 3006
}

export const InvalidCredentialsErrorType = {
  name: 'InvalidCredentials',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Credentials does not match',
  errorCode: 3007
}

export const InvalidTokenErrorType = {
  name: 'InvalidToken',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Session Expired, Please login to continue.',
  errorCode: 3008
}

export const InvalidSessionErrorType = {
  name: 'InvalidSession',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'User session is not valid, please re-login',
  errorCode: 3009
}

export const InvalidAccessErrorType = {
  name: 'InvalidAccess',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Permission denied',
  errorCode: 3010
}

export const NonOperationalErrorType = {
  name: 'NonOperationalError',
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  isOperational: false,
  description: 'Error occurred on server',
  errorCode: 3011
}

export const UserNotExistsErrorType = {
  name: 'UserNotExists',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'User does not exists',
  errorCode: 3012
}

export const InvalidActionErrorType = {
  name: 'InvalidAction',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid action',
  errorCode: 3013
}

export const SessionAlreadyStartedErrorType = {
  name: 'SessionAlreadyStarted',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Session already started',
  errorCode: 3014
}

export const SessionNotStartedErrorType = {
  name: 'SessionNotStarted',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Session not started',
  errorCode: 3015
}

export const EmailNotVerifiedErrorType = {
  name: 'EmailNotVerified',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Email not verified',
  errorCode: 3016
}

export const InvalidGameTypeErrorType = {
  name: 'InvalidGameTypeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'No settings found for the provided game type',
  errorCode: 3017
}

export const InvalidGameRoundErrorType = {
  name: 'InvalidGameRoundError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'No game found for the provided game details',
  errorCode: 3018
}

export const NoRoundRunningErrorType = {
  name: 'NoRoundRunningError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'No round is running as of now',
  errorCode: 3019
}

export const NoPlacedBetFoundErrorType = {
  name: 'NoPlacedBetFoundError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'No placed bet found',
  errorCode: 3020
}

export const NoWalletFoundErrorType = {
  name: 'NoWalletFoundErrorr',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Wallet not found with the specified data',
  errorCode: 3021
}
export const NotEnoughBalanceErrorType = {
  name: 'NotEnoughBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Balance is not to perform the process',
  errorCode: 3022
}
export const AutoRateIsInvalidErrorType = {
  name: 'AutoRateIsInvalidError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Auto Rate is not in the limit',
  errorCode: 3023
}
export const BetAmountIsNotInLimitErrorType = {
  name: 'BetAmountIsNotInLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bet Amount is not in the limits',
  errorCode: 3024
}
export const EmailNotFoundErrorType = {
  name: 'EmailNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Email not Found',
  errorCode: 3025
}

export const UserNotAbove18YearsErrorType = {
  name: 'UserNotAbove18YearsError',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'UserNotAbove18YearsError',
  errorCode: 3026
}

export const InvalidBlockchainAddressErrorType = {
  name: 'InvalidBlockchainAddress',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Blockchain Address',
  errorCode: 3027
}

export const AddressMismatchErrorType = {
  name: 'AddressMismatch',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Given Address And Recovered Address Mismatch',
  errorCode: 3028
}

export const NonceLifetimeExpiredErrorType = {
  name: 'NonceLifetimeExpired',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Nonce Life time Expired',
  errorCode: 3029
}

export const SomethingWentWrongErrorType = {
  name: 'SomethingWentWrong',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Something Went Wrong',
  errorCode: 3030
}

export const AccountNotActiveErrorType = {
  name: 'AccountNotActive',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Account is not active',
  errorCode: 3031
}

export const LoginTokenRequireErrorType = {
  name: 'LoginTokenRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'otp required',
  errorCode: 3032
}

export const UserAlreadyExistsErrorType = {
  name: 'UserAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User already exists',
  errorCode: 3033
}

export const InvalidVerificationTokenErrorType = {
  name: 'InvalidVerificationToken',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid verification token',
  errorCode: 3034
}

export const UserNotActiveErrorType = {
  name: 'UserNotActive',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User is blocked, please contact admin.',
  errorCode: 3035
}

export const FileUploadFailedErrorType = {
  name: 'FileUploadFailed',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Image upload failed',
  errorCode: 3036
}

export const EmailAlreadyVerifiedErrorType = {
  name: 'EmailAlreadyVerified',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Email Already verified',
  errorCode: 3037
}

export const InvalidReferralCodeErrorType = {
  name: 'InvalidReferralCode',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Referral Code',
  errorCode: 3038
}

export const InvalidAffiliateCodeErrorType = {
  name: 'InvalidAffiliateCode',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Affiliate Code',
  errorCode: 3039
}

export const RecordNotFoundErrorType = {
  name: 'RecordNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Record Not Found',
  errorCode: 3040
}

export const WithdrawalRequestAlreadyPendingErrorType = {
  name: 'WithdrawalRequestAlreadyPending',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Withdraw request is already pending',
  errorCode: 3040
}
