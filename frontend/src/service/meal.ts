import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000', 
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
}

export async function get(path, params) {
    const res = await api.get(path, { params });
    return res.data;
}

export async function post(path, data) {
    const res = await api.post(path, data);
    return res.data;
}

export async function put(path, data) {
    const res = await api.put(path, data);
    return res.data;
}

export async function del(path) {
    const res = await api.delete(path);
    return res.data;
}

export default api;