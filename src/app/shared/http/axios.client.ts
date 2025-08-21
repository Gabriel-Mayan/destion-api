import axios from 'axios';

export default axios.create({
  baseURL: process.env.API_BASE_URL || 'https://default-url.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});
