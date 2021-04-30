import axios from 'axios';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';
import qs from 'qs';

const sign = jwt.sign;

const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;
const server_url = process.env.UPBIT_OPEN_API_SERVER_URL;
const notice_url = process.env.UPBIT_NOTICE_API_SERVER_URL;

const payload = {
    access_key: access_key,
    nonce: v4(),
};

const token = sign(payload, secret_key);

const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'brackets' });
    },
};

export const upbitApi = axios.create({
    baseURL: server_url,
    ...options,
});

upbitApi.interceptors.request.use((config) => {
    const { url, method, headers, baseURL } = config;
    console.log({
        url,
        method,
        headers,
        baseURL,
    });

    return config;
});

upbitApi.interceptors.response.use(function (res) {
    const { data, status, statusText } = res;
    console.log({ data, status, statusText });
    return res;
});
