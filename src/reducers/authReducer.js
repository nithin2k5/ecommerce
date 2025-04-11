import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: localStorage.getItem('token') ? true : false,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        user: {
          username: action.payload.username,
          roles: action.payload.roles
        },
        error: null
      };
    case LOGIN_FAIL:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer; 