import axios from 'axios';
import { baseURL, appId } from './constants';
const http = axios.create({
  baseURL: baseURL
});

http.interceptors.request.use((config) => {
  config.headers['X-App-Id'] = appId;
  return config;
});

export default http;