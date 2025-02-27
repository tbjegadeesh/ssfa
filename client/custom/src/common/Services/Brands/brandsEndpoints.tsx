// brandsEndpoints.ts

import { BASE_URL } from '../Baseurl';

export const brandEndpoints = {
  getBrands: () => `${BASE_URL}/brands`,
  getBrandById: (id: string) => `${BASE_URL}/brands/${id}`,
  createBrand: () => `${BASE_URL}/brands`,
  updateBrand: (id: any) => `${BASE_URL}/brands/${id}`,
  deleteBrand: (id: string) => `${BASE_URL}/brands/${id}`,
};
