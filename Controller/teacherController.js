const teacherSchema = require("../Model/teacherModel");
const classSchema = require("../Model/classModel");
const bcrypt = require("bcrypt");
const fs = require("fs");

exports.insertTeacher = async (req, res, next) => {
    try {
        const { fullname, password, email, role } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        if (req.file) {
            // Constructing the image filename using template literals
            req.body.image = `${new Date().toLocaleDateString().replace(/\//g, '-')}-${req.file.originalname}`;
            fs.writeFile(`./images/teachers/${req.body.image}`, req.file.buffer, (err) => {
                if (err) return next(err);
            });
        }
        
        // Check if the email already exists in the database
        const existingTeacher = await teacherSchema.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: "Email already exists, please use another email" });
        }
        const existingAdmin = await teacherSchema.findOne({ role: "admin" });
        if (existingAdmin && role === "admin") {
            return res.status(400).json({ message: "Admin already exists, There can be only one admin" });
        }
        // Create a new teacher instance
        const teacher = new teacherSchema({
            fullname,
            email,
            password: hashedPassword, // Use the hashed password
            image: req.body.image,
            role
        });

        // Save the teacher to the database
        await teacher.save();

        res.status(200).json({ data: "new teacher added" });
    } catch (err) {
        next(err);
    }
};
exports.getAllTeachers = (req, res, next) => {
    teacherSchema.find()
        .then((data) => res.status(200).json(data))
        .catch((err) => next(err));

    // res.status(200).json({ data: [] });
};

exports.getTeacherById = (req, res, next) => {
    const id = req.params.id;
    teacherSchema.findById(id)
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Teacher not found" });
            }
            res.status(200).json(data);
        })
        .catch((err) => next(err));
};

exports.updateTeacher = async (req, res, next) => {
    try {
        const id = req.body._id;
        const { fullname, password, email, role } = req.body;

        // add image
        if (req.file) {
            // Constructing the image filename using template literals
            req.body.image = `${new Date().toLocaleDateString().replace(/\//g, '-')}-${req.file.originalname}`;
            fs.writeFile(`./images/${req.body.image}`, req.file.buffer, (err) => {
                if (err) return next(err);
            });
        }

        // Hash the password if provided
        if (password) {
            req.body.password = bcrypt.hashSync(password, 10);
        }
        const existingTeacher = await teacherSchema.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: "Email already exists, please use another email" });
        }

        const existingAdmin = await teacherSchema.findOne({ role: "admin" });
        if (existingAdmin && role === "admin") {
            return res.status(400).json({ message: "Admin already exists, There can be only one admin" });
        }

        // Update the teacher information
        const updatedTeacher = await teacherSchema.findByIdAndUpdate(id, req.body, { new: true });

        // If teacher is not found, return 404 status
        if (!updatedTeacher) {
            return res.status(404).json({ data: "Teacher not found" });
        }

        res.status(200).json({ data: "updated" });
    } catch (err) {
        next(err);
    }
};


exports.deleteTeacher = async (req, res, next) => {
    const id = req.params.id;

    try {
        // Find the teacher to be deleted
        const teacher = await teacherSchema.findById(id);
        if (!teacher) {
            res.status(404).json({ data: "Teacher not found" });
        }

        // Check if the teacher is supervising any classes
        const classes = await classSchema.find({ supervisor: id });

        if (classes.length > 0) {
            const defaultSupervisor = await teacherSchema.findOne({ _id: { $ne: id } });;

            await classSchema.updateMany({ supervisor: id }, { supervisor: defaultSupervisor._id });
        }

        // Proceed with teacher deletion
        await teacherSchema.findByIdAndDelete(id);

        res.status(200).json({ data: "Teacher deleted" });
    } catch (err) {
        next(err);
    }
};


exports.getAllSupervisors = (req, res, next) => {
    classSchema.aggregate([
        {
            $group: {
                _id: "$supervisor",
                supervisor: { $first: "$supervisor" }
            }
        },
        {
            $lookup: {
                from: "teachers",
                localField: "_id",
                foreignField: "_id",
                as: "supervisorData"
            }
        },
        {
            $project: {
                _id: "$supervisor",
                fullname: { $arrayElemAt: ["$supervisorData.fullname", 0] }
            }
        }
    ])
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "No supervisors found" });
                return;
            }

            res.status(200).json(data);
        })
        .catch((err) => next(err));
};
exports.changePassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const teacher = await teacherSchema.findById(id);

        if (!teacher) {
            res.status(404).json({ message: "Teacher not found" });
        }
        const validPassword = await bcrypt.compare(req.body.oldPassword, teacher.password);

        if (!validPassword) {
            res.status(400).json({ message: "Invalid password" });
        }

        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

        await teacherSchema.findByIdAndUpdate(id, { password: hashedPassword });
        res.status(200).json({ message: "Password changed successfully" });


    } catch (err) {
        next(err);
    }
}
exports.registerTeacher = async (req, res, next) => {
    try {
        const { fullname, password, email } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (req.file) {
            // Constructing the image filename using template literals
            req.body.image = `${new Date().toLocaleDateString().replace(/\//g, '-')}-${req.file.originalname}`;
            fs.writeFile(`./images/teachers/${req.body.image}`, req.file.buffer, (err) => {
                if (err) return next(err);
            });
        }

        // Check if the email already exists in the database
        const existingTeacher = await teacherSchema.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: "Email already exists, please use another email" });
        }

        // Create a new teacher instance
        const teacher = new teacherSchema({
            fullname,
            email,
            password: hashedPassword, // Use the hashed password
            image: req.body.image,
            role: "teacher" // Hardcoded role as "teacher"
        });

        // Save the teacher to the database
        await teacher.save();

        res.status(200).json({ data: "new teacher added" });
    } catch (err) {
        next(err);
    }
};
