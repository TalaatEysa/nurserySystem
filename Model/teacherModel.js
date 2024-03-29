const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    // },
    fullname: {
        type: String,
        required: true,
       
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "teacher"],
        required: true,
    },
});

module.exports = mongoose.model("teacher", teacherSchema);

