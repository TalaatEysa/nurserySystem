const teacherSchema = require("../Model/teacherModel");
const jwt = require("jsonwebtoken");
exports.login = (req, res, next) => {
    teacherSchema.findOne({ fullname: req.body.fullname, password: req.body.password })
        .then((data) => {
            if (!data) {
                throw new Error("Teacher not found");
            }
            const token = jwt.sign({
                _id: data._id,
                role: data.role
            },
                process.env.SECRETKEY,
                { expiresIn: "24h" }
            );

            res.json({ data: "authenticated", token });

        })
        .catch((err) => next(err));
    
}