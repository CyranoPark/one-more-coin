import mongoose from 'mongoose';
const { Schema } = mongoose;

const marketSchema = new Schema({
    market: String,
    name: String,
    market_warning: String,
});

const Market = mongoose.model('Market', marketSchema);

export default Market;
