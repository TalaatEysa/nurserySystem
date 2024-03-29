const teacherSchema = require("../Model/teacherModel");
const classSchema = require("../Model/classModel");
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
    const teacher = new teacherSchema(req.body);
    teacher.save()
        .then((data) => {
            res.status(200).json({ data: "new teacher added" });
        })
        .catch((err) => next(err));
    
    // res.status(200).json({ data: "added" });
};

exports.updateTeacher = (req, res, next) => {
    const id = req.body._id;
    teacherSchema.findByIdAndUpdate(id, req.body, { new: true })
        .then((data) => {
            if (!data) {
                res.status(404).json({ data: "Teacher not found" });
            }
            res.status(200).json({data: "updated" });
        
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
            res.status(200).json({data: "deleted" });
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
            const defaultSupervisor = await teacherSchema.findOne({ _id: { $ne: ObjectId(_id) } });;

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
    classSchema.find({})
        .populate({
            path: "supervisor",
            select: {fullname: 1},
        })
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Class not found" });
            }
            let SupervisorData = data.map((item) => item.supervisor);
            res.status(200).json(SupervisorData);
        })
        .catch((err) => next(err));
    
    
    
    
    // res.status(200).json({ data: [] });
    // res.status(200).json({ data: req.params });

}