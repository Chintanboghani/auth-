const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const transaction_history = new Schema({
    progress_id         : { type: ObjectId, ref: 'userProgress', default: null, index: true  },
    order_id            : { type: ObjectId, ref: 'order_summary', default: null, index: true  },
    coinbase_id         : { type: String,required: true},
    getway              : { type: String,default:"coinbase"},
    coinbase_data       : { type: Object, required: true},
    }, {
        timestamps: true,
    });

module.exports = mongoose.model('transaction_history', transaction_history, 'transaction_history');