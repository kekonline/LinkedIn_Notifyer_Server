import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken && authToken !== "undefined" && authToken !== null && authToken !== "") {
        config.headers.authorization = `Bearer ${authToken}`;
    }
    return config;
});

export default axiosInstance;
