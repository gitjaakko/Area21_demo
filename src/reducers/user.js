import { LOGIN_USER, LOGOUT_USER } from '../actions';

const INITIAL_STATE = {
  accessToken: null,
  refreshToken: null,
  thingsboard: null,
  isAuthenticated: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, accessToken: action.accessToken, refreshToken: action.refreshToken, thingsboard: action.thingsboard, isAuthenticated: true };
    case LOGOUT_USER:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};
