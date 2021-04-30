import express from 'express';
import axios from 'axios';
import UpbitService from '../service/UpbitService';

const router = express.Router();

router.get('/', async function (req, res, next) {
    const result = await UpbitService.insertAllMarkets();

    res.send(result);
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
