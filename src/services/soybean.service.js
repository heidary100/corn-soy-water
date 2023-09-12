import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/soybean';

const getSoybeans = () => axios.get(API_URL, { headers: authHeader() });

const createSoybean = (soybean) => axios.post(API_URL, { headers: authHeader(), ...soybean });

const getSoybeanById = (soybeanId) => axios.get(`${API_URL}/${soybeanId}`, { headers: authHeader() });

const updateSoybean = (soybeanId, soybean) => axios.put(`${API_URL}/${soybeanId}`, { headers: authHeader(), ...soybean });

const deleteSoybeanById = (soybeanId) => axios.delete(`${API_URL}/${soybeanId}`, { headers: authHeader() });

const SoybeanService = {
  getSoybeans,
  createSoybean,
  getSoybeanById,
  updateSoybean,
  deleteSoybeanById,
};

export default SoybeanService;
