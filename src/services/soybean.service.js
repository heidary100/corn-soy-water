// import axios from 'axios';
// import authHeader from './auth-header';

// const API_URL = 'http://localhost:8080/api/soybean';
const sleep = (delay) => new Promise((resolve) => { setTimeout(resolve, delay); });
// const getSoybeans = () => axios.get(API_URL, { headers: authHeader() });
const getSoybeans = async () => {
  await sleep(200);
  if (localStorage.soybeans !== undefined) {
    return JSON.parse(localStorage.soybeans);
  } return [];
};

// const createSoybean = (soybean) => axios.post(API_URL, { headers: authHeader(), ...soybean });
const createSoybean = async (soybean) => {
  const id = Math.round(Math.random() * 10000);
  const soybeans = await getSoybeans();
  soybeans.push({ id, ...soybean });
  localStorage.soybeans = JSON.stringify(soybeans);
};

// const getSoybeanById = (soybeanId) =>
// axios.get(`${API_URL}/${soybeanId}`, { headers: authHeader() });
const getSoybeanById = async (soybeanId) => {
  const soybeans = await getSoybeans();
  const soybean = soybeans.find(
    (p) => Number.parseInt(p.id, 10) === Number.parseInt(soybeanId, 10),
  );
  if (soybean) {
    soybean.plantingDate = new Date(soybean.plantingDate);
    return soybean;
  }
  throw Error;
};

// const updateSoybean = (soybeanId, soybean) =>
// axios.put(`${API_URL}/${soybeanId}`, { headers: authHeader(), ...soybean });
const updateSoybean = async (soybeanId, soybean) => {
  const soybeans = await getSoybeans();
  const updatedSoybeans = soybeans.map(
    (p) => {
      if (Number.parseInt(p.id, 10) === Number.parseInt(soybeanId, 10)) {
        return soybean;
      }
      return p;
    },
  );
  localStorage.soybeans = JSON.stringify(updatedSoybeans);
};

// const deleteSoybeanById = (soybeanId) =>
// axios.delete(`${API_URL}/${soybeanId}`, { headers: authHeader() });
const deleteSoybeanById = async (soybeanId) => {
  const soybeans = await getSoybeans();
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
