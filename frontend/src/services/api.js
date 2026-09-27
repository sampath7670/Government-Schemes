import axios from 'axios';

const API_BASE_URL = '/api';

export const fetchStates = async () => {
  const response = await axios.get(`${API_BASE_URL}/states`);
  return response.data;
};

export const fetchSchemes = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/schemes`, { params });
  return response.data;
};

export const fetchSchemesByState = async (stateName) => {
  const response = await axios.get(`${API_BASE_URL}/schemes/state/${encodeURIComponent(stateName)}`);
  return response.data;
};

export const fetchSchemeById = async (schemeId) => {
  const response = await axios.get(`${API_BASE_URL}/schemes/${encodeURIComponent(schemeId)}`);
  return response.data;
};

export const searchSchemes = async (filterData) => {
  const response = await axios.post(`${API_BASE_URL}/schemes/search`, filterData);
  return response.data;
};

export const checkEligibility = async (profileData) => {
  const response = await axios.post(`${API_BASE_URL}/eligibility/check`, profileData);
  return response.data;
};

export const fetchSources = async () => {
  const response = await axios.get(`${API_BASE_URL}/sources`);
  return response.data;
};
