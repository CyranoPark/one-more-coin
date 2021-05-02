import axios from 'axios';

export const sendMessage = ({ text, blocks }) => {
    return axios.post(process.env.SLACK_WEBHOOK_URL, { text, blocks });
};

export default {
    sendMessage,
};
