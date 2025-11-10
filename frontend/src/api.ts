import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});
const MOCK_USER = {
  userId: 1, 
  
  providerId: 1, 
};

export const getMockUserId = () => {
  return MOCK_USER.userId;
};

export const getMockProviderId = () => {
  return MOCK_USER.providerId;
};
