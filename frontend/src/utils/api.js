import axios from 'axios';
import { getBaseUrl } from './baseURL';

// Create a pre-configured axios instance for API requests
const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, // Important: enables sending cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;