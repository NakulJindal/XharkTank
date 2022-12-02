const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
    investor: String,
    amount: Number,
    equity: Number,
    comment: String
});

module.exports = mongoose.model("offer", OfferSchema);