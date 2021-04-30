import express from 'express';
import { upbitApi } from '../api/upbit';
import axios from 'axios';

const router = express.Router();

router.get('/', async function (req, res, next) {
    const { data } = await upbitApi.get(
        'https://project-team.upbit.com/api/v1/disclosure?region=kr&per_page=20'
    );

    res.send(data);
});

router.get('/notice', async function (req, res, next) {
    try {
        const { data } = await axios.get(
            process.env.UPBIT_NOTICE_API_SERVER_URL
        );

        res.send(data);
    } catch (e) {
        console.log(e);
    }
});

export default router;
