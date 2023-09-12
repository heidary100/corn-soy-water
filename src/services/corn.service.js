import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/corn";

const getCorns = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const createCorn = (corn) => {
    return axios.post(API_URL, { headers: authHeader(), ...corn });
};

const getCornById = (cornId) => {
    return axios.get(API_URL + '/' + cornId, { headers: authHeader() });
};

const updateCorn = (cornId, corn) => {
    return axios.put(API_URL + '/' + cornId, { headers: authHeader() , ...corn});
};

const deleteCornById = (cornId) => {
    return axios.delete(API_URL + '/' + cornId, { headers: authHeader() });
};

const CornService = {
    getCorns,
    createCorn,
    getCornById,
    updateCorn,
    deleteCornById,
};

export default CornService;