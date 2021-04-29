const axios = require('axios');

const server_url = process.env.SLACK_WEBHOOK_URL;

const slackApi = axios.create({
    baseURL: server_url,
    timeout: 5000,
});

module.exports = slackApi;
