import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5001/api" 
    : "https://chatbackend-beige.vercel.app/", // Replace with your actual Cyclic URL
  withCredentials: true,
});