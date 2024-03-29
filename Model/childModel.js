const mongoose = require("mongoose");

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
        required: true,
        // unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    level: {
        type: String,
        enum: ["PreKG", "KG1", "KG2"],
        required: true,
    },
    address: addressSchema,
});
module.exports = mongoose.model("child", childSchema);


