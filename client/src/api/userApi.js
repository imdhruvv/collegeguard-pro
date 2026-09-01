import axios from 'axios';
const API_URL = 'http://localhost:5000/api/users';

export const getAllUsers = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.token : null;
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};
