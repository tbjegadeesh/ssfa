// Auth.ts
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token'); // Adjust this as needed
  return !!token; // Returns true if the token exists
};
