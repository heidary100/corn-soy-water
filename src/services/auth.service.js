// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/auth/';

const sleep = (delay) => new Promise((resolve) => { setTimeout(resolve, delay); });

// const registerUser = async (user) => {
//   const response = await axios.post(`${API_URL}register`, user);
//   return response.data;
// };
const registerUser = async (user) => {
  await sleep(200);
  localStorage.user = JSON.stringify(user);
  return user;
};

// const loginUser = async (username, password) => {
//   const response = await axios.post(`${API_URL}login`, {
//     username,
//     password,
//   });

//   if (response.data.accessToken) {
//     localStorage.setItem('user', JSON.stringify(response.data));
//   }

//   return response.data;
// };
// eslint-disable-next-line no-unused-vars
const loginUser = async (username, password) => {
  const user = { accessToken: 'hey', username };
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => JSON.parse(localStorage.getItem('user'));

const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return true;
  } return false;
};

const AuthService = {
  registerUser,
  loginUser,
  logout,
  getCurrentUser,
  isAuthenticated,
};

export default AuthService;
