import axios from 'axios';
const API_URL = 'http://localhost:5000/api/performance';

export const getStudentPerformance = async (studentId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.token : null;
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/${studentId}`, config);
  return response.data;
};
