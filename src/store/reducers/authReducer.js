const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token'),
  isAuthenticated: localStorage.getItem('token') !== null,
  error: null,
  loading: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: {
          username: action.payload.username,
          roles: action.payload.roles
        },
        token: action.payload.token,
        error: null,
        loading: false
      };
    case 'LOGIN_FAIL':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        loading: false
      };
    default:
      return state;
  }
};

export default authReducer; 