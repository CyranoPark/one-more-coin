import { upbitApi } from '../api/upbit';

class StrategyService {
    k = 0.5;

    getVolatilityList = async (market, minutes) => {
        const { data } = await upbitApi.get(`/v1/candles/minutes/${minutes}`, {
            params: { market, count: 200 },
        });

        const volumes = data.map((item) => {
            return {
                low: item.low_price,
                high: item.high_price,
                open: item.opening_price,
                trade: item.trade_price,
                volume: item.opening_price - item.trade_price,
            };
        });

        console.log(data);
        return volumes;
    };
}

export default new StrategyService();
