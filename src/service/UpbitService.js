import { upbitApi } from '../api/upbit';
import Market from '../model/Markets';
import {
    findBuyPoint,
    findSellPoint,
    macd,
    mergeSalePoints,
} from '../util/macd';
import reverse from 'lodash/reverse';
import { ma } from 'moving-averages';

export const insertAllMarkets = async () => {
    const { data } = await upbitApi.get('/v1/market/all', {
        params: { isDetails: true },
    });

    const docs = data.map((market) => {
        return {
            name: market.korean_name,
            market: market.market,
            market_warning: market.market_warning,
        };
    });

    await Market.insertMany(docs);
    return docs;
};

export const deleteAllMarkets = () => {
    return Market.deleteMany({});
};

export const getSalePoints = async (market, minutes = 60, count = 200) => {
    const { data } = await upbitApi.get(`/v1/candles/minutes/${minutes}`, {
        params: { market, count },
    });
    const reversed = reverse(data);

    return mergeSalePoints(reversed);
};

export const getCurrentBuyPoint = async (minutes = 60) => {
    const salePoints = {};
    const { data: markets } = await upbitApi.get('/v1/market/all', {
        params: { isDetails: true },
    });
    markets.length = 10;
    for (let i = 0; i < markets.length; i++) {
        const salesRes = await getSalePoints(markets[i].market, minutes);
        salePoints[markets[i].korean_name] = salesRes[0];
    }

    return salePoints;
};

export default {
    insertAllMarkets,
    deleteAllMarkets,
    getSalePoints,
    getCurrentBuyPoint,
};
