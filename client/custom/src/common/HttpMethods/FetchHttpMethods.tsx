type ErrorResponse = {
  message?: string;
  statusCode?: number;
};

type RequestConfig<T> = {
  url: string;
  formData?: T;
  //   params?: Record<string, any>;
};
const BASE_URL = 'http://localhost:5000/api';

// Utility function for parsing the response and checking for errors
async function handleFetchResponse<R>(response: Response): Promise<R> {
  if (!response.ok) {
    const errorBody: ErrorResponse = await response.json();
    const errorMessage = errorBody?.message || 'Unknown error occurred';
    throw new Error(errorMessage);
  }
  return response.json();
}

// Generic GET request using fetch
export async function getRequest<R>(
  url: string,
  params?: Record<string, any>,
): Promise<R | undefined> {
  try {
    const queryParams = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    const response = await fetch(`${url}${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleFetchResponse<R>(response);
  } catch (error: unknown) {
    return handleFetchError(error);
  }
}

// Generic POST request using fetch
export async function postRequest<T, R>({
  url,
  formData,
}: RequestConfig<T>): Promise<R | undefined> {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return await handleFetchResponse<R>(response);
  } catch (error: unknown) {
    return handleFetchError(error);
  }
}

// Generic PUT request using fetch
export async function putRequest<T, R>({
  url,
  formData,
}: RequestConfig<T>): Promise<R | undefined> {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return await handleFetchResponse<R>(response);
  } catch (error: unknown) {
    return handleFetchError(error);
  }
}

// Generic DELETE request using fetch
export async function deleteRequest<R>(
  url: string,
  params?: Record<string, any>,
): Promise<R | undefined> {
  try {
    const queryParams = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    const response = await fetch(`${url}${queryParams}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleFetchResponse<R>(response);
  } catch (error: unknown) {
    return handleFetchError(error);
  }
}

// Centralized error handling for fetch
function handleFetchError(error: unknown): undefined {
  if (error instanceof Error) {
    console.error('Fetch error:', error.message);
    throw new Error(
      error.message || 'Network error. Please check your connection.',
    );
  } else {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred.');
  }
}
