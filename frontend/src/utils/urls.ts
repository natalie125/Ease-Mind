export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

export const publicUrl = isProduction
  ? '/larks'
  : '/';

export const apiUrl = isProduction
  ? process.env.REACT_APP_DEV
  : process.env.REACT_APP_PROD;
