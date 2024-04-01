const classSchema = require("../Model/classModel");
const childSchema = require("../Model/childModel");
const teacherSchema = require("../Model/teacherModel");
exports.getAllClasses = (req, res, next) => {
    classSchema.find({})
        .populate({ path: "supervisor", select: { _id: 0, fullname: 1 } })
        .populate({ path: "children", select: { _id: 0, fullName: 1 } })
        .then((data) => res.status(200).json(data))
        .catch((err) => next(err));

};

exports.getClassById = (req, res, next) => {
    const id = req.params.id;
    classSchema.findById(id)
        .populate({ path: "supervisor", select: { _id: 0, fullname: 1 } })
        .populate({ path: "children", select: { _id: 0, fullName: 1 } })
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json(data);
        })
        .catch((err) => next(err));

};
exports.insertClass = async (req, res, next) => {
    try {
        const supervisor = await teacherSchema.findById(req.body.supervisor);
        if (!supervisor) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        const childrenArray = await childSchema.find({ _id: { $in: req.body.children } });
        if (childrenArray.length !== req.body.children.length) {
            // throw new Error(`${req.body.children.length - childrenArray.length} children not found`);
            return res.status(404).json({ message: "children number is greater than registered" });
        }
        const existingClass = await classSchema.findOne({ name: req.body.name });
        if (existingClass) {
            return res.status(400).json({ message: "class name already exists, please use another name" });

        }
        const newClass = new classSchema(req.body);
        await newClass.save();

        res.status(200).json({ data: "new class added" });
    } catch (err) {
        next(err);
    }
};


exports.updateClass = async (req, res, next) => {
    if (req.body.supervisor!=null) {
        const teacher = await teacherSchema.findOne({ _id: req.body.supervisor });
        if (!teacher) {
            next(new Error("Teacher not found"));
        }
    } else if (req.body.children != null) {
        const children = await childSchema.find({ _id: { $in: req.body.children } });
        if (children.length !== req.body.children.length) {
            next(new Error(`${req.body.children.length - children.length} children not found`));
        }
    }
    const existingClass = await classSchema.findOne({ name: req.body.name });
    if (existingClass) {
        next(new Error("class name already exists, please use another name"));
    }
    classSchema.findByIdAndUpdate(req.body._id, req.body, { new: true })
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json({ data: "updated" });
        })
        .catch((err) => next(err));

    // res.status(200).json({ data: "updated" });
};

exports.deleteClass = (req, res, next) => {
    classSchema.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json({ data: "deleted" });
        })
        .catch((err) => next(err));
    // res.status(200).json({ data: "deleted" });
}
exports.getClassChildrenInfo = (req, res, next) => {
    classSchema.findOne({ _id: req.params.id }, { _id: 0, children: 1, })
        .populate({ path: "children", select: { _id: 0, fullName: 1 } })
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json(data);
        })
        .catch((err) => next(err));


}
exports.getClassTeacherInfo = (req, res, next) => {
    classSchema.find({ supervisor: req.params.id }, { _id: 0, supervisor: 1, })
        .populate({ path: "supervisor", select: { _id: 0, fullname: 1 } })
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json(data);
        })
        .catch((err) => next(err));
}
