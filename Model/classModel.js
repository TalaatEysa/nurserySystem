const mongoose = require("mongoose");
const sequence = require("mongoose-sequence")(mongoose);
const classSchema = new mongoose.Schema({
    _id: {
        type: Number,

    },
    name: {
        type: String,
        required: true,
        unique: true
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
classSchema.plugin(sequence, { id: "class", incField:"_id" });

module.exports = mongoose.model("class", classSchema);

