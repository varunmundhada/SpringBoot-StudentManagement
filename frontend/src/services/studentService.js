import axios from 'axios';

const API_BASE_URL = 'https://cold-news-slide.loca.lt/api/Student';

const studentService = {
  getAllStudents: async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  createStudent: async (student) => {
    const response = await axios.post(API_BASE_URL, student);
    return response.data;
  },

  updateStudent: async (id, student) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, student);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};

export default studentService;
