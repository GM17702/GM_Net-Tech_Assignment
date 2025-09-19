import axios from "axios";

// central axios
const api = axios.create({
  baseURL: "http://localhost:3000/api/documents", // adjust if different
});

export default api;