const teacherSchema = require("../Model/teacherModel");
const classSchema = require("../Model/classModel");
const bcrypt = require("bcrypt");
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
    // res.status(200).json({ data: req.params });
};

exports.insertTeacher = (req, res, next) => {
    const { fullname, password, email, image, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    // const teacher = new teacherSchema(req.body);
    const teacher = new teacherSchema(
        {
            fullname,
            email,
            password: hashedPassword,
            image,
            role
        }) 
    teacher.save()
        .then((data) => {
            res.status(200).json({ data: "new teacher added" });
        })
        .catch((err) => next(err));

    // res.status(200).json({ data: "added" });
};

exports.updateTeacher = (req, res, next) => {
    const id = req.body._id;
    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    teacherSchema.findByIdAndUpdate(id, req.body, { new: true })
        .then((data) => {
            if (!data) {
                res.status(404).json({ data: "Teacher not found" });
            }
            res.status(200).json({ data: "updated" });

        }).catch((err) => next(err));


    // res.status(200).json({ data: "updated" });
};

exports.deleteTeacher = (req, res, next) => {
    const id = req.params.id;
    teacherSchema.findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                res.status(404).json({ data: "Teacher not found" });
            }
            res.status(200).json({ data: "deleted" });
        })
        .catch((err) => next(err));



    // res.status(200).json({ data: "deleted" });
}

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







// exports.getAllSupervisors = (req, res, next) => {
//     classSchema.find({})
//         .populate({
//             path: "supervisor",
//             select: { fullname: 1 },
//         })
//         .then((data) => {
//             if (!data) {
//                 res.status(404).json({ message: "Class not found" });
//             }
//             let SupervisorData = data.map((item) => item.supervisor);
//             res.status(200).json(SupervisorData);
//         })
//         .catch((err) => next(err));




//     // res.status(200).json({ data: [] });
//     // res.status(200).json({ data: req.params });

// }
exports.getAllSupervisors = (req, res, next) => {
    classSchema.aggregate([
        {
            $group: {
                _id: "$supervisor",
                supervisor: { $first: "$supervisor" } // Preserve the supervisor field
            }
        },
        {
            $lookup: {
                from: "teachers", // Assuming the teacher collection name is "teachers"
                localField: "_id",
                foreignField: "_id",
                as: "supervisorData"
            }
        },
        {
            $project: {
                _id: "$supervisor", // Rename _id to supervisor
                fullname: { $arrayElemAt: ["$supervisorData.fullname", 0] } // Extract fullname from the lookup result
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
        
        
    }catch (err) {
        next(err);
    }
}