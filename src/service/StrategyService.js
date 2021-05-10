import { upbitApi } from '../api/upbit';
import reverse from 'lodash/reverse';

class StrategyService {
    k = 0.5;

    getVolatilityList = async (market, minutes) => {
        const { data } = await upbitApi.get(`/v1/candles/minutes/${minutes}`, {
            params: { market, count: 168 },
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

        const reversed = reverse(volumes);

        let seed = 1000000;

        const positions = reversed.map((data, i) => {
            if (!i) return { position: 'stay', balance: seed };

            const prev = reversed[i - 1];
            const buyPrice = data.open + prev.volume * this.k;

            if (prev.volume > 0 && data.high > buyPrice) {
                const income = data.trade - buyPrice;
                seed = seed * 0.9995 * (data.trade / buyPrice) * 0.9995;
                console.log('buy:', buyPrice, 'Sell: ', data.trade);
                return {
                    position: 'buy',
                    buyPrice,
                    sellPrice: data.trade,
                    income,
                    balance: seed,
                };
            }

            return { position: 'stay', balance: seed };
        });

        return positions;
    };
}

export default new StrategyService();
