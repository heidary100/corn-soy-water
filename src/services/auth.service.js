import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

const registerUser = async (user) => {
  const response = await axios.post(`${API_URL}register`, user);
  return response.data;
};

const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}login`, {
    username,
    password,
  });

  if (response.data.accessToken) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => JSON.parse(localStorage.getItem('user'));

const AuthService = {
  registerUser,
  loginUser,
  logout,
  getCurrentUser,
};

export default AuthService;
