const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const teacherRoute = require('./Routes/teacherRoute');
const childRoute = require('./Routes/childRoute');
const classRoute = require('./Routes/classRoute');
const loginRoute = require('./Routes/authentication');
const authenticationMW = require('./Middlewares/authenticationMW');
const server = express();
const multer = require('multer');
const path = require('path');
const port = process.env.PORT || 8080;

//image variables
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(path.join(__dirname,'images'));
        cb(null,path.join(__dirname,'images'))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toLocaleDateString().replace(/\//g, '-') + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png') {
            cb(null, true);
    }
    else {
        cb(null, false);
    }
}


//first middleware for login 
server.use(morgan(":method :url"));
//second middleware for cors
server.use(cors());

server.use("/images", express.static(path.join(__dirname, "images")));
server.use(multer({ storage,fileFilter}).single('image'));
server.use(express.json());
// EndPoints
server.use(loginRoute);
server.use(authenticationMW);
server.use(teacherRoute);
server.use(childRoute);
server.use(classRoute);

//third middleware Not found
server.use((request, response, next) => {
    response.status(404).json({ data: "page not found" });
});
//last middleware error
server.use((error, request, response, next) => {

    response.status(500).json({ data: ` ${error}` })

});

mongoose.connect(process.env.URL)
    .then(() => {
        console.log("DB connected");
        server.listen(port, () => {
            console.log("server is listenng.....", port);
        });
    })
    .catch(error => {
        console.log("Db Problem " + error);
    })

