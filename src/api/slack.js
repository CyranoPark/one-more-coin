import axios from 'axios';
import qs    from 'qs';

const server_url = process.env.SLACK_WEBHOOK_URL;

const slackApi = axios.create({
    baseURL: server_url,
    timeout: 5000,
    paramsSerializer: function (params) {
        return qs.stringify(params, {arrayFormat: 'brackets'})
    },
});

export default slackApi;
