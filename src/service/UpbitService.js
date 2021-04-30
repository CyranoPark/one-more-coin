import { upbitApi } from '../api/upbit';
import Market from '../model/Markets';

const insertAllMarkets = async () => {
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

export default {
    insertAllMarkets,
};
