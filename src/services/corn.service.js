// import axios from 'axios';
// import authHeader from './auth-header';

// const API_URL = 'http://localhost:3000/api/corn';

const sleep = (delay) => new Promise((resolve) => { setTimeout(resolve, delay); });

// const getCorns = () => axios.get(API_URL, { headers: authHeader() });
const getCorns = async () => {
  await sleep(200);
  if (localStorage.corns !== undefined) {
    return JSON.parse(localStorage.corns);
  } return [];
};

// const createCorn = (corn) => axios.post(API_URL, { headers: authHeader(), ...corn });
const createCorn = async (corn) => {
  const id = Math.round(Math.random() * 10000);
  const corns = await getCorns();
  corns.push({ id, ...corn });
  localStorage.corns = JSON.stringify(corns);
  return { id, ...corn };
};

const addIrrigationRecord = async (record, cornId) => {
  const corns = await getCorns();
  const addedRecord = { id: Math.round(Math.random() * 10000), ...record };
  const updatedCorns = corns.map(
    (corn) => {
      if (Number.parseInt(corn.id, 10) === Number.parseInt(cornId, 10)) {
        let irrigations = [];
        if (corn.irrigations) {
          irrigations = corn.irrigations;
        }
        irrigations.push(addedRecord);
        return { ...corn, irrigations };
      }
      return corn;
    },
  );
  localStorage.corns = JSON.stringify(updatedCorns);
  return addedRecord;
};

const deleteIrrigationById = async (cornId, irrigationRecordId) => {
  const corns = await getCorns();
  const updatedCorns = corns.map(
    (corn) => {
      if (Number.parseInt(corn.id, 10) === Number.parseInt(cornId, 10)) {
        let irrigations = [];
        if (corn.irrigations) {
          irrigations = corn.irrigations;
        }
        irrigations = irrigations.filter((item) => item.id !== irrigationRecordId);
        return { ...corn, irrigations };
      }
      return corn;
    },
  );
  localStorage.corns = JSON.stringify(updatedCorns);
};

// const getCornById = (cornId) => axios.get(`${API_URL}/${cornId}`, { headers: authHeader() });
const getCornById = async (cornId) => {
  const corns = await getCorns();
  const corn = corns.find(
    (p) => Number.parseInt(p.id, 10) === Number.parseInt(cornId, 10),
  );
  if (corn) {
    corn.plantingDate = new Date(corn.plantingDate);
    return corn;
  }
  throw Error;
};

// const updateCorn = (cornId, corn) =>
// axios.put(`${API_URL}/${cornId}`, { headers: authHeader(), ...corn });
const updateCorn = async (cornId, corn) => {
  const corns = await getCorns();
  const updatedCorns = corns.map(
    (p) => {
      if (Number.parseInt(p.id, 10) === Number.parseInt(cornId, 10)) {
        return corn;
      }
      return p;
    },
  );
  localStorage.corns = JSON.stringify(updatedCorns);
};

// const deleteCornById = (cornId) =>
// axios.delete(`${API_URL}/${cornId}`, { headers: authHeader() });
const deleteCornById = async (cornId) => {
  const corns = await getCorns();
  localStorage.corns = JSON.stringify(corns.filter((p) => p.id === cornId));
};
const CornService = {
  getCorns,
  createCorn,
  getCornById,
  updateCorn,
  deleteCornById,
  addIrrigationRecord,
  deleteIrrigationById,
};

export default CornService;
