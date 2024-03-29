const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        // unique: true
    },
    name: {
        type: String,
        required: true,
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true,
    },
    children: [{
        type: Number,
        ref: 'child',
        required: true
    }] 

});

module.exports = mongoose.model("class", classSchema);

