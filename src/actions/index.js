export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGIN_USER = 'LOGIN_USER';

export const loginUser = (accessToken, refreshToken, thingsboard) => ({
    type: LOGIN_USER,
    accessToken,
    refreshToken,
    thingsboard
});
