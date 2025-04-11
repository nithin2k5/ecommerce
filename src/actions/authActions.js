import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';

export const login = (userData) => {
  return {
    type: LOGIN_SUCCESS,
    payload: userData
  };
};

export const loginFail = (error) => {
  return {
    type: LOGIN_FAIL,
    payload: error
  };
};

export const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  return {
    type: LOGOUT
  };
}; 