const mongoose = require("mongoose");
const sequence = require("mongoose-sequence")(mongoose);

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    building: {
        type: String,
        required: true,
    }
},{_id: false});
const childSchema = new mongoose.Schema({
    _id: {
        type: Number,

    },
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: ["PreKG", "KG1", "KG2"],
        required: true,
    },
    address: addressSchema,
});
childSchema.plugin(sequence, { id: "child", incField: "_id" });

module.exports = mongoose.model("child", childSchema);


