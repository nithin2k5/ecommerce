/**
 * Helper function to create authorization headers for API requests
 * Returns appropriate headers with JWT token if user is logged in
 */
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token') || localStorage.getItem('businessToken');

  if (user && token) {
    // For Spring Boot backend with JWT
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
} 