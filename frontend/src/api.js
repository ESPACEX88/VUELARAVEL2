import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:80/pruebaLaravel/public/api/',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;