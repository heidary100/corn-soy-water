import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/soybean';

// const getSoybeans = () => axios.get(API_URL, { headers: authHeader() });
const getSoybeans = () => {
  if (localStorage.soybeans !== undefined) {
    return JSON.parse(localStorage.soybeans);
  } return [];
};

// const createSoybean = (soybean) => axios.post(API_URL, { headers: authHeader(), ...soybean });
const createSoybean = (soybean) => {
  const id = Math.round(Math.random() * 10000);
  const soybeans = getSoybeans();
  soybeans.push({ id, ...soybean });
  localStorage.soybeans = JSON.stringify(soybeans);
};

// const getSoybeanById = (soybeanId) =>
// axios.get(`${API_URL}/${soybeanId}`, { headers: authHeader() });
const getSoybeanById = (soybeanId) => {
  const soybeans = getSoybeans();
  return soybeans.find((p) => p.id === soybeanId);
};

const updateSoybean = (soybeanId, soybean) => axios.put(`${API_URL}/${soybeanId}`, { headers: authHeader(), ...soybean });

// const deleteSoybeanById = (soybeanId) =>
// axios.delete(`${API_URL}/${soybeanId}`, { headers: authHeader() });
const deleteSoybeanById = (soybeanId) => {
  const soybeans = getSoybeans();
  localStorage.soybeans = JSON.stringify(soybeans.filter((p) => p.id === soybeanId));
};

const SoybeanService = {
  getSoybeans,
  createSoybean,
  getSoybeanById,
  updateSoybean,
  deleteSoybeanById,
};

export default SoybeanService;
