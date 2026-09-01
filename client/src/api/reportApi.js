import axios from 'axios';
const API_URL = 'http://localhost:5000/api/reports';

export const downloadUserReport = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.token : null;
  
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob', // Important for file downloads
  };

  const response = await axios.get(`${API_URL}/users`, config);
  return response.data;
};
