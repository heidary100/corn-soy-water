// import axios from 'axios';
// import authHeader from './auth-header';

// const API_URL = 'http://localhost:3000/api/corn';
import fields from '../test_data/fields.json';

const defaultFields = fields.records.filter((record) => record.crop === 'corn').map((record) => ({
  id: record.id,
  lat: parseFloat(record.flat),
  lng: parseFloat(record.flon),
  name: record.name,
  plantingDate: record.cpdate,
  plantPopulation: record.cppopulation,
  relativeMaturity: record.crmaturity,
  soilRootingDepth: record.srdepth,
  soilSurfaceResiduesCoverage: record.ssresidues,
  topSoilBulkDensity: record.tsdensity,
  topSoilMoistureAtPlanting: record.tsmoisture,
  subSoilMoistureAtPlanting: record.ssmoisture,
  topSoilTexture: record.tstexture,
  subSoilTexture: record.sstexture,
  irrigations: record.irrdata.map((irr) => (
    { id: Math.round(Math.random() * 10000), amount: irr.amount, date: irr.date })),
}));

// const getCorns = () => axios.get(API_URL, { headers: authHeader() });
const getCorns = async () => {
  if (localStorage.corns !== undefined) {
    return [...defaultFields, ...JSON.parse(localStorage.corns)];
  } return defaultFields;
};

// const createCorn = (corn) => axios.post(API_URL, { headers: authHeader(), ...corn });
const createCorn = async (corn) => {
  const id = Math.round(Math.random() * 10000);
  let corns = [];
  if (localStorage.corns !== undefined) {
    corns = JSON.parse(localStorage.corns);
  }
  corns.push({ id, ...corn });
  localStorage.corns = JSON.stringify(corns);
  return { id, ...corn };
};

const addIrrigationRecord = async (record, cornId) => {
  let corns = [];
  if (localStorage.corns !== undefined) {
    corns = JSON.parse(localStorage.corns);
  }
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
  let corns = [];
  if (localStorage.corns !== undefined) {
    corns = JSON.parse(localStorage.corns);
  }
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
  let corns = [];
  if (localStorage.corns !== undefined) {
    corns = JSON.parse(localStorage.corns);
  }
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
  let corns = [];
  if (localStorage.corns !== undefined) {
    corns = JSON.parse(localStorage.corns);
  }
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
