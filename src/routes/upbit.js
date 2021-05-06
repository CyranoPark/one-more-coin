import express from 'express';
import {
    deleteAllMarkets,
    getBuyPointByMarket,
    getCandles,
    getNotices,
    getVolatilityBreakoutPoints,
    insertAllMarkets,
} from '../controller/market.controller';

const router = express.Router();

router.post('/markets', insertAllMarkets);
router.delete('/markets', deleteAllMarkets);
router.get('/markets/vb', getVolatilityBreakoutPoints);
router.get('/markets/candles', getCandles);
router.get('/markets/buy', getBuyPointByMarket);
router.get('/notice', getNotices);

export default router;
