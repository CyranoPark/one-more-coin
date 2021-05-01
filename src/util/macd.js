import { ema } from 'moving-averages';
import { sub, mul } from 'math-array';
import reverse from 'lodash/reverse';

export const macd = (
    data,
    slowPeriods = 26,
    fastPeriods = 12,
    signalPeriods = 9
) => {
    const MACD = sub(ema(data, fastPeriods), ema(data, slowPeriods), 1);

    const signal = ema(MACD, signalPeriods);
    const histogram = mul(2, sub(MACD, signal), 1);

    return {
        MACD,
        signal,
        histogram,
    };
};

export const findBuyPoint = ({ MACD, signal, histogram }) => {
    const buyIndice = [];
    MACD.forEach((macd, i) => {
        if (MACD[i - 1] > signal[i - 1]) {
            return;
        }
        if (macd > signal[i]) {
            buyIndice.push(i);
        }
    });

    return buyIndice;
};

export const findSellPoint = ({ MACD, signal, histogram }) => {
    const sellIndice = [];
    MACD.forEach((macd, i) => {
        if (MACD[i - 1] < signal[i - 1]) {
            return;
        }
        if (macd < signal[i]) {
            sellIndice.push(i);
        }
    });

    return sellIndice;
};

export const mergeSalePoints = (candles) => {
    const macds = macd(candles.map((candle) => candle.trade_price));
    const buyIndice = reverse(findBuyPoint(macds));
    const sellIndice = reverse(findSellPoint(macds));

    const buyPositions = buyIndice.map((i) => ({
        ...candles[i],
        position: 'BUY',
    }));
    const sellPositions = sellIndice.map((i) => ({
        ...candles[i],
        position: 'SELL',
    }));

    const merged = [...buyPositions, ...sellPositions];
    merged.sort(
        (a, b) =>
            new Date(b.candle_date_time_utc) - new Date(a.candle_date_time_utc)
    );
    return merged;
};

export default macd;
