export const API_URL = import.meta.env.VITE_ENV === 'development' 
  ? import.meta.env.VITE_API_LOCAL 
  : import.meta.env.VITE_API_LIVE;