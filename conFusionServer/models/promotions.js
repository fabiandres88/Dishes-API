const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseCurrency = require('mongoose-currency');
mongooseCurrency.loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
})

var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;