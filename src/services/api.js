import axios from "axios";

const API_BASE_URL = "https://wedding-venues.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - har bir so'rovga token qo'shish
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 xatolarda logout qilish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Toshkent rayonlari
export const districts = [
  { id: 1, name: "Bektemir" },
  { id: 2, name: "Chilonzor" },
  { id: 3, name: "Mirobod" },
  { id: 4, name: "Mirzo Ulug'bek" },
  { id: 5, name: "Olmazor" },
  { id: 6, name: "Sergeli" },
  { id: 7, name: "Shayxontohur" },
  { id: 8, name: "Uchtepa" },
  { id: 9, name: "Yakkasaroy" },
  { id: 10, name: "Yangihayon" },
  { id: 11, name: "Yunusobod" },
];
