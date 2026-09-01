import axios from 'axios';
const API_URL = 'http://localhost:5000/api/wellness';

const getConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user ? user.token : null;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const submitSurvey = async (surveyData) => {
  const response = await axios.post(`${API_URL}/submit`, surveyData, getConfig());
  return response.data;
};

export const getSurveyResults = async () => {
  const response = await axios.get(`${API_URL}/results`, getConfig());
  return response.data;
};
