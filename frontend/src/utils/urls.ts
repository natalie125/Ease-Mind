export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

export const prodPublicUrl = process.env.REACT_APP_PUBLIC_URL_PROD;
export const devPublicUrl = process.env.REACT_APP_PUBLIC_URL_DEV;

export const publicUrl = isProduction
  ? prodPublicUrl
  : devPublicUrl;

export const apiUrl = isProduction
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;
