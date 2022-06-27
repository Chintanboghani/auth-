const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId, Mixed } = Schema.Types;

const userProgressSchema = new Schema({
    user_id                : { type: ObjectId, ref:"user", index: true },
    user_type              : { type: String },
    user_email             : { type: String,  max: 255 },
    application_number     : { type: String, required: true, default: "" },
    last_filled_data       : { type: Mixed,  default: {} },
    form_completed         : { type: Boolean, default: false},
    pdf_path               : { type: String, default: ''},
    pdf_response           : { type: String, default: ''},
    form_name              : { type: String, required: true},
    }, {
        timestamps: true,
    });

module.exports = mongoose.model('userProgress', userProgressSchema, 'userProgresses');