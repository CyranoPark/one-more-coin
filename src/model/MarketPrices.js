import mongoose from 'mongoose';
const { Schema } = mongoose;

const pricesSchema = new Schema({
    market: String,
    candle_date_time_utc: String,
    candle_date_time_kst: String,
    opening_price: Number,
    high_price: Number,
    low_price: Number,
    trade_price: Number,
    timestamp: Number,
    candle_acc_trade_price: Number,
    candle_acc_trade_volume: Number,
    prev_closing_price: Number,
    change_price: Number,
    change_rate: Number,
    converted_trade_price: Number,
});

const marketPricesSchema = new Schema({
    market: String,
    name: String,
    type: String,
    prices: [pricesSchema],
});

const MarketPrice = mongoose.model('MarketPrice', marketPricesSchema);

export default MarketPrice;
