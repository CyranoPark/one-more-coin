import UpbitService from '../service/UpbitService';
import axios from 'axios';

export const insertAllMarkets = async (req, res, next) => {
    try {
        await UpbitService.deleteAllMarkets();
        const result = await UpbitService.insertAllMarkets();

        res.send(result);
    } catch (e) {
        next(e);
    }
};

export const deleteAllMarkets = async (req, res, next) => {
    try {
        const result = await UpbitService.deleteAllMarkets();

        res.send(result);
    } catch (e) {
        next(e);
    }
};

export const getNotices = async (req, res, next) => {
    try {
        const { data } = await axios.get(
            process.env.UPBIT_NOTICE_API_SERVER_URL
        );

        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const getCandles = async (req, res, next) => {
    try {
        const { market, minutes, count } = req.query;
        const candles = await UpbitService.getSalePoints(
            market,
            minutes,
            count
        );

        res.send(candles);
    } catch (e) {
        next(e);
    }
};

export const getBuyPointByMarket = async (req, res, next) => {
    try {
        const { minutes } = req.query;
        const candles = await UpbitService.getCurrentBuyPoint(minutes);
        res.send(candles);
    } catch (e) {
        next(e);
    }
};
