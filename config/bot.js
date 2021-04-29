require('dotenv').config();
module.exports = {
    SLACK_APP_ID: process.env.SLACK_APP_ID,
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    SLACK_VERIFICATION_TOKEN: process.env.SLACK_VERIFICATION_TOKEN,
};
