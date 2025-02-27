// const getBaseUrl = (): string => {
//   switch (process.env.REACT_APP_ENV) {
//     case 'development':
//       return process.env.REACT_APP_API_URL_DEV || '';
//     case 'staging':
//       return process.env.REACT_APP_API_URL_STAGING || '';
//     case 'production':
//       return process.env.REACT_APP_API_URL_PROD || '';
//     default:
//       throw new Error('Invalid environment');
//   }
// };

export const BASE_URL = 'http://localhost:5000/api';
// getBaseUrl();
