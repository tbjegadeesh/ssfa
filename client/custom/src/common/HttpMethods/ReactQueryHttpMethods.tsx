// httpServices.tsx
import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Base URL for your API
const BASE_URL = 'http://localhost:5000/api';

// Define a type for the error response
interface HttpError {
  message: string;
  status?: number;
}

// Generic function to handle errors
const handleError = (error: unknown): HttpError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
  return { message: 'An unexpected error occurred' };
};

// HTTP Service methods
const httpService = {
  get: <T>(url: string, config?: AxiosRequestConfig) => {
    return useQuery<T, HttpError>([url], async () => {
      const response = await axios.get<T>(`${BASE_URL}${url}`, config);
      return response.data;
    }, {
      onError: (error) => {
        const err = handleError(error);
        console.error(err.message);
      },
    });
  },

  post: <T, R>(url: string, config?: AxiosRequestConfig) => {
    return (data: R): UseMutationResult<T, HttpError, R> => {
      return useMutation<T, HttpError, R>(async (variables) => {
        const response = await axios.post<T>(`${BASE_URL}${url}`, variables, config);
        return response.data;
      }, {
        onError: (error) => {
          const err = handleError(error);
          console.error(err.message);
        },
      });
    };
  },

  put: <T, R>(url: string, config?: AxiosRequestConfig) => {
    return (data: R): UseMutationResult<T, HttpError, R> => {
      return useMutation<T, HttpError, R>(async (variables) => {
        const response = await axios.put<T>(`${BASE_URL}${url}`, variables, config);
        return response.data;
      }, {
        onError: (error) => {
          const err = handleError(error);
          console.error(err.message);
        },
      });
    };
  },

  delete: <T>(url: string, config?: AxiosRequestConfig) => {
    return useMutation<T, HttpError, void>(async () => {
      const response = await axios.delete<T>(`${BASE_URL}${url}`, config);
      return response.data;
    }, {
      onError: (error) => {
        const err = handleError(error);
        console.error(err.message);
      },
    });
  },
};

export default httpService;
