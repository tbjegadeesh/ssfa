import axios, { AxiosError, AxiosResponse } from 'axios';

type ErrorResponse = {
  message?: string;
  statusCode?: number;
};

type RequestConfig<T> = {
  url: string;
  data?: T;
  params?: Record<string, any>;
};

// Axios instance (customize base URL, headers, etc.)
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic GET request
export async function get<R>(
  url: string,
  params?: Record<string, any>,
): Promise<R | undefined> {
  try {
    const response: AxiosResponse<R> = await axiosInstance.get(url, { params });
    return handleAxiosResponse<R>(response); // Handle success response
  } catch (error: unknown) {
    return handleAxiosError(error); // Ensure a return in case of error
  }
}
// Generic POST request
export async function post<T, R>({
  url,
  data,
}: {
  url: string;
  data: T;
}): Promise<R | undefined> {
  try {
    const response: AxiosResponse<R> = await axios.post(url, data);
    return handleAxiosResponse<R>(response); // Handle success response
  } catch (error) {
    return handleAxiosError(error); // Handle errors
  }
}

// Generic PUT request (if not defined, you might need to create it)
export async function put<T, R>({
  url,
  data,
}: {
  url: string;
  data: T;
}): Promise<R | undefined> {
  try {
    const response: AxiosResponse<R> = await axios.put(url, data);
    return handleAxiosResponse<R>(response); // Handle success response
  } catch (error) {
    return handleAxiosError(error); // Handle errors
  }
}

// Generic DELETE request
export async function deleteRequest<R>(
  url: string,
  params?: Record<string, any>,
): Promise<R | undefined> {
  try {
    const response: AxiosResponse<R> = await axiosInstance.delete(url, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    return handleAxiosError(error); // Ensure a return in case of error
  }
}
export function handleAxiosResponse<R>(response: AxiosResponse<R>): R {
  switch (response.status) {
    case 200:
    case 201:
      // Success logic for 200 and 201 status codes
      console.log('Success:', response.data);
      return response.data;
    default:
      // Any other 2xx response
      console.warn(`Unexpected success status: ${response.status}`);
      return response.data;
  }
}

export function handleAxiosError(error: unknown): undefined {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      console.log(axiosError, 'axiosErroraxiosError');
      const status = axiosError.response.status;
      const serverMessage =
        axiosError.response.data.message || 'Unknown server error';

      switch (status) {
        case 400:
          console.error('Bad Request (400):', serverMessage);
          throw new Error(`Bad Request: ${serverMessage}`);
        case 401:
          console.error('Unauthorized (401):', serverMessage);
          throw new Error(`Unauthorized: ${serverMessage}`);
        case 404:
          console.error('Not Found (404):', serverMessage);
          throw new Error(`Not Found: ${serverMessage}`);
        case 500:
          console.error('Internal Server Error (500):', serverMessage);
          throw new Error(`Server Error: ${serverMessage}`);
        default:
          console.error(`Error (${status}):`, serverMessage);
          throw new Error(`Unexpected error: ${serverMessage}`);
      }
    } else {
      // Network errors or request errors (no response received)
      console.error('Network error:', axiosError.message);
      throw new Error('Network error. Please check your connection.');
    }
  } else {
    // Non-Axios error (unexpected error)
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred.');
  }
}
