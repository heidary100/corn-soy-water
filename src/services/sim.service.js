import axios from 'axios';

const API_KEY = 'e57c858f031526a86bcd7caf50842cf2';
const SOY_SIM_API_URL = 'http://hprcc-agron0.unl.edu/cornsoywater/api/soy/?SoySimData';
const CORN_SIM_API_URL = 'http://hprcc-agron0.unl.edu/cornsoywater/api/corn';

const getCornSimData = (corn) => axios.post(
  CORN_SIM_API_URL,
  {
    apiKey: API_KEY,
    flat: corn.lat,
    flon: corn.lng,
    cpdate: `${corn.plantingDate.getDate()}/${corn.plantingDate.getMonth()}/${corn.plantingDate.getFullYear()}`,
    crmaturity: corn.relativeMaturity,
    cppopulation: corn.plantPopulation,
    srdepth: corn.soilRootingDepth,
    ssresidues: corn.soilSurfaceResiduesCoverage,
    tsdensity: corn.topSoilBulkDensity,
    tsmoisture: corn.topSoilMoistureAtPlanting,
    ssmoisture: corn.subSoilMoistureAtPlanting,
    tstexture: corn.topSoilTexture,
    sstexture: corn.subSoilTexture,
    sresult: 'cstage',
  },
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
