// import axios from 'axios';
// import authHeader from './auth-header';

// const API_URL = 'http://localhost:3000/api/user';

const sleep = (delay) => new Promise((resolve) => { setTimeout(resolve, delay); });

// const getUser = () => axios.get(API_URL, { headers: authHeader() });
// const getUser = async () => {
//   await sleep(5000);
//   if (localStorage.user !== undefined) {
//     const currentUser = JSON.parse(localStorage.user);
//     const users = JSON.parse(localStorage.users);
//     return users.find(
//       (p) => Number.parseInt(p.id, 10) === Number.parseInt(currentUser.id, 10),
//     );
//   } return {};
// };
const getUser = async () => {
  await sleep(200);
  if (localStorage.user !== undefined) {
    return JSON.parse(localStorage.user);
  } return {};
};

// const updateUser = (user) =>
// axios.put(API_URL, { headers: authHeader(), ...user });
const updateUser = async (user) => {
  await sleep(200);
  if (localStorage.user !== undefined) {
    localStorage.user = JSON.stringify(user);
  }
};

const UserService = {
  getUser,
  updateUser,
};

export default UserService;
