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
        // required: true,
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
childSchema.plugin(sequence, { id: "child", incField: "_id" });
// childSchema.statics.resetSequence = async function () {
//     try {
//         const count = await this.countDocuments();
//         if (count === 0) {
//             await this.updateOne({}, { $set: { _id: 1 } });
//         } else {
//             await this.updateOne({}, { $set: { _id: count + 1 } });
//         }
//     } catch (error) {
//         console.error("Error resetting sequence:", error);
//     }
// };

module.exports = mongoose.model("child", childSchema);


