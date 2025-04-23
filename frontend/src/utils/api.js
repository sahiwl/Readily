import axios from 'axios';
import { getBaseUrl } from './baseURL.js';

//pre-configured axios instance for api reqs
const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, //sends cookies with reqs
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;