const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.cyclic.app/api' 
  : 'http://localhost:5001/api';

export default API_BASE_URL;