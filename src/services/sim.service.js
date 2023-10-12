import axios from 'axios';

const API_KEY = 'e57c858f031526a86bcd7caf50842cf2';
const SOY_SIM_API_URL = 'http://hprcc-agron0.unl.edu/cornsoywater/api/soy/?SoySimData';
const CORN_SIM_API_URL = 'http://hprcc-agron0.unl.edu/cornsoywater/api/corn/?CornSimData';

const getCornSimData = (cornSimData) => axios.post(
  CORN_SIM_API_URL,
  { apiKey: API_KEY, ...cornSimData },
);

const getSoySimData = (soySimData) => axios.post(
  SOY_SIM_API_URL,
  { apiKey: API_KEY, ...soySimData },
);

const SimService = {
  getCornSimData,
  getSoySimData,
};

export default SimService;
