import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/soybean";

const getSoybeans = () => {
    return axios.get(API_URL, { headers: authHeader() });
};

const createSoybean = (soybean) => {
    return axios.post(API_URL, { headers: authHeader(), ...soybean });
};

const getSoybeanById = (soybeanId) => {
    return axios.get(API_URL + '/' + soybeanId, { headers: authHeader() });
};

const updateSoybean = (soybeanId, soybean) => {
    return axios.put(API_URL + '/' + soybeanId, { headers: authHeader() , ...soybean});
};

const deleteSoybeanById = (soybeanId) => {
    return axios.delete(API_URL + '/' + soybeanId, { headers: authHeader() });
};

const SoybeanService = {
    getSoybeans,
    createSoybean,
    getSoybeanById,
    updateSoybean,
    deleteSoybeanById,
};

export default SoybeanService;