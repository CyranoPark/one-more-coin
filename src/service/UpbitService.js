import { upbitApi } from '../api/upbit';
import Market from '../model/Markets';
import {
    findBuyPoint,
    findSellPoint,
    macd,
    mergeSalePoints,
} from '../util/macd';
import reverse from 'lodash/reverse';
import schedule from 'node-schedule';
import { ma } from 'moving-averages';
import MarketPrice from '../model/MarketPrices';
import SlackService from './SlackService';

export const insertAllMarkets = async () => {
    const { data } = await upbitApi.get('/v1/market/all', {
        params: { isDetails: true },
    });

    const docs = data
        .filter((item) => item.market.startsWith('KRW'))
        .map((market) => {
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
    let count = 0;
    const { data } = await upbitApi.get('/v1/market/all', {
        params: { isDetails: true },
    });

    const markets = data.filter((item) => item.market.startsWith('KRW'));

    const job = schedule.scheduleJob('*/5 * * * * *', async () => {
        if (!markets[count]) {
            job.cancel();
            return;
        }
        const salesPoints = await getSalePoints(markets[count].market, minutes);
        const recentPoint = new Date(salesPoints[0].candle_date_time_kst);

        const info = {
            position: salesPoints[0].position,
            date: recentPoint,
            kr_date: salesPoints[0].candle_date_time_kst,
            market: salesPoints[0].market,
            price: salesPoints[0].trade_price,
        };

        if (
            info.position === 'BUY' &&
            new Date().getDate() === new Date(info.kr_date).getDate()
        ) {
            const blocks = [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: '매수점이다 중생들아',
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*종목:*\n${info.market}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*시간:*\n${info.kr_date}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*가격:*\n${info.price}`,
                        },
                    ],
                },
            ];
            await SlackService.sendMessage({ blocks });
        }
        count++;
    });

    return 'ok';
};

export const getMarketPrices = async () => {
    let count = 0;
    const { data: markets } = await upbitApi.get('/v1/market/all', {
        params: { isDetails: true },
    });

    const job = schedule.scheduleJob('*/5 * * * * *', async () => {
        if (!markets[count]) {
            job.cancel();
            return;
        }

        const salesRes = await upbitApi.get(`/v1/candles/minutes/${minutes}`, {
            params: { market: markets[count].market, count: 200 },
        });
        const query = {
            market: markets[count].market,
        };
        const newData = {
            market: markets[count].market,
            name: markets[count].korean_name,
            type: `${minutes}분`,
            prices: salesRes.data,
        };
        const marketPrice = MarketPrice.findOne(query);

        if (marketPrice) {
            await MarketPrice.findOneAndUpdate(query, newData);
        } else {
            const newMarketPrice = new MarketPrice();

            newMarketPrice.market = newData.market;
            newMarketPrice.name = newData.name;
            newMarketPrice.type = newData.type;
            newMarketPrice.prices = newData.prices;

            await newMarketPrice.save();
        }
        count++;
    });
};

export default {
    insertAllMarkets,
    deleteAllMarkets,
    getSalePoints,
    getCurrentBuyPoint,
};
