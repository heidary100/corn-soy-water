import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/corn';

const getCorns = () => axios.get(API_URL, { headers: authHeader() });

const createCorn = (corn) => axios.post(API_URL, { headers: authHeader(), ...corn });

const getCornById = (cornId) => axios.get(`${API_URL}/${cornId}`, { headers: authHeader() });

const updateCorn = (cornId, corn) => axios.put(`${API_URL}/${cornId}`, { headers: authHeader(), ...corn });

const deleteCornById = (cornId) => axios.delete(`${API_URL}/${cornId}`, { headers: authHeader() });

const CornService = {
  getCorns,
  createCorn,
  getCornById,
  updateCorn,
  deleteCornById,
};

export default CornService;
