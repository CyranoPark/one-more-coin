const axios = require('axios');
const uuid = require("uuid")
const sign = require('jsonwebtoken').sign

const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY
const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY
const server_url = process.env.UPBIT_OPEN_API_SERVER_URL

const payload = {
    access_key: access_key,
    nonce: uuid.v4(),
}

const token = sign(payload, secret_key)

const options = {
    method: "GET",
    headers: {Authorization: `Bearer ${token}`},
}

const upbitApi = axios.create({
    baseURL: server_url,
    ...options
});

module.exports = upbitApi;
