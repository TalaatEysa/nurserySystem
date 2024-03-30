const teacherSchema = require("../Model/teacherModel");
const jwt = require("jsonwebtoken");
const bcrypt= require("bcrypt");
exports.login = async (req, res, next) => {
    try {
        const teacher = await teacherSchema.findOne({ fullname: req.body.fullname })
        if (!teacher) {
            throw new Error("Teacher not found");
        }
        const passwordMatch = await bcrypt.compare(req.body.password, teacher.password);
        if (passwordMatch) {
            const token = jwt.sign({
                _id: teacher._id,
                role: teacher.role
            },
                process.env.SECRETKEY,
                { expiresIn: "24h" }
            );

            res.json({ data: "authenticated", token });
        }
         

    } catch (err) {
        next(err);
    }
}
