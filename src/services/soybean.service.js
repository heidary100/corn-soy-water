// import axios from 'axios';
// import authHeader from './auth-header';

// const API_URL = 'http://localhost:8080/api/soybean';
import fields from '../test_data/fields.json';

const defaultFields = fields.records.filter((record) => record.crop === 'soybean').map((record) => ({
  id: record.id,
  lat: parseFloat(record.flat),
  lng: parseFloat(record.flon),
  name: record.name,
  plantingDate: record.cpdate,
  maturityGroup: record.crmaturity,
  soilRootingDepth: record.srdepth,
  availableSoilWater: record.ssmoisture,
  averageSoilTexture: record.tstexture,
  irrigations: record.irrdata.map((irr) => (
    { id: Math.round(Math.random() * 10000), amount: irr.amount, date: irr.date })),
}));

// const getSoybeans = () => axios.get(API_URL, { headers: authHeader() });
const getSoybeans = async () => {
  if (localStorage.soybeans !== undefined) {
    return [...defaultFields, ...JSON.parse(localStorage.soybeans)];
  } return defaultFields;
};

// const createSoybean = (soybean) => axios.post(API_URL, { headers: authHeader(), ...soybean });
const createSoybean = async (soybean) => {
  const id = Math.round(Math.random() * 10000);
  let soybeans = [];
  if (localStorage.soybeans !== undefined) {
    soybeans = JSON.parse(localStorage.soybeans);
  }
  soybeans.push({ id, ...soybean });
  localStorage.soybeans = JSON.stringify(soybeans);
  return { id, ...soybean };
};

const addIrrigationRecord = async (record, soybeanId) => {
  let soybeans = [];
  if (localStorage.soybeans !== undefined) {
    soybeans = JSON.parse(localStorage.soybeans);
  }
  const addedRecord = { id: Math.round(Math.random() * 10000), ...record };
  const updatedSoybeans = soybeans.map(
    (soybean) => {
      if (Number.parseInt(soybean.id, 10) === Number.parseInt(soybeanId, 10)) {
        let irrigations = [];
        if (soybean.irrigations) {
          irrigations = soybean.irrigations;
        }
        irrigations.push(addedRecord);
        return { ...soybean, irrigations };
      }
      return soybean;
    },
  );
  localStorage.soybeans = JSON.stringify(updatedSoybeans);
  return addedRecord;
};

const deleteIrrigationById = async (soybeanId, irrigationRecordId) => {
  let soybeans = [];
  if (localStorage.soybeans !== undefined) {
    soybeans = JSON.parse(localStorage.soybeans);
  }
  const updatedSoybean = soybeans.map(
    (soybean) => {
      if (Number.parseInt(soybean.id, 10) === Number.parseInt(soybeanId, 10)) {
        let irrigations = [];
        if (soybean.irrigations) {
          irrigations = soybean.irrigations;
        }
        irrigations = irrigations.filter((item) => item.id !== irrigationRecordId);
        return { ...soybean, irrigations };
      }
      return soybean;
    },
  );
  localStorage.soybeans = JSON.stringify(updatedSoybean);
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
  let soybeans = [];
  if (localStorage.soybeans !== undefined) {
    soybeans = JSON.parse(localStorage.soybeans);
  }
  const updatedSoybeans = soybeans.map(
    (p) => {
      if (Number.parseInt(p.id, 10) === Number.parseInt(soybeanId, 10)) {
        return { ...soybean, id: soybeanId };
      }
      return p;
    },
  );
  localStorage.soybeans = JSON.stringify(updatedSoybeans);
};

// const deleteSoybeanById = (soybeanId) =>
// axios.delete(`${API_URL}/${soybeanId}`, { headers: authHeader() });
const deleteSoybeanById = async (soybeanId) => {
  let soybeans = [];
  if (localStorage.soybeans !== undefined) {
    soybeans = JSON.parse(localStorage.soybeans);
  }
  localStorage.soybeans = JSON.stringify(soybeans.filter((p) => p.id === soybeanId));
};

const SoybeanService = {
  getSoybeans,
  createSoybean,
  getSoybeanById,
  updateSoybean,
  deleteSoybeanById,
  addIrrigationRecord,
  deleteIrrigationById,
};

export default SoybeanService;
