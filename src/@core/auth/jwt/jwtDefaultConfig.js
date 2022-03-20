// ** Auth Endpoints
export const URL = 'http://localhost:3000/'

export default {
  loginEndpoint: `${URL}account/login`,
  registerEndpoint: `${URL}account/register`,
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: '/jwt/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
