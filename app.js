const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
const teacherRoute = require('./Routes/teacherRoute');
const childRoute = require('./Routes/childRoute');
const classRoute = require('./Routes/classRoute');
const loginRoute = require('./Routes/authentication');
const registerRoute = require('./Routes/registerRoute');
const authenticationMW = require('./Middlewares/authenticationMW');
const server = express();

const port = process.env.PORT || 8080;


//swagger variables
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nursery System API Documentation',
            version: '1.0.0',
            description: 'Nursery System aims to help parents and teachers manage their children growth and development.',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Development server'
            }
        ]
    },
    apis: ['./Routes/*.js']
}
const swaggerSpec = swaggerJSDoc(options);


//first middleware for login 
server.use(morgan(":method :url"));
//second middleware for cors
server.use(cors());


server.use(express.json());
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// EndPoints
server.use(loginRoute);
server.use(registerRoute);
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

