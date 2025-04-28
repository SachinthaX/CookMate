import { jwtDecode } from 'jwt-decode'; // ✅ correct for v4+

export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const { exp } = jwtDecode(token); // ✅ renamed function
  return Date.now() < exp * 1000;
};
