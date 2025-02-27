// userEndPoints.ts

import { BASE_URL } from '../Baseurl';

export const userEndpoints = {
  login: () => `${BASE_URL}/login`,
  getUsers: () => `${BASE_URL}/users`,
  getUserById: (id: string) => `${BASE_URL}/users/${id}`,
  createUser: () => `${BASE_URL}/users`,
  updateUser: (id: string) => `${BASE_URL}/users/${id}`,
  deleteUser: (id: string) => `${BASE_URL}/users/${id}`,
};
