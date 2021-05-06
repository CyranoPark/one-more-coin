import { upbitApi } from '../api/upbit';

class StrategyService {
    k = 0.5;

    getVolatilityList = async (market, minutes) => {
        const { data } = await upbitApi.get(`/v1/candles/minutes/${minutes}`, {
            params: { market, count: 200 },
        });

        console.log(data);
        return data;
    };
    volatilityBreakout;
}

export default new StrategyService();
