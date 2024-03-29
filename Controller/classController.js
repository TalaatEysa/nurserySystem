const classSchema = require("../Model/classModel");
const childSchema = require("../Model/childModel");
const teacherSchema = require("../Model/teacherModel");
exports.getAllClasses = (req, res, next) => {
    classSchema.find({})
        .populate({ path: "supervisor", select: { _id: 0, fullname: 1 } })
        .populate({ path: "children", select: { _id: 0, fullName: 1 } })
        .then((data) => res.status(200).json(data))
        .catch((err) => next(err));

    // res.status(200).json({ data: [] });
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

    // res.status(200).json({ data: req.params });
};

exports.insertClass = (req, res, next) => {
    teacherSchema.findOne({ _id: req.body.supervisor })
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Teacher not found" });
            } else {
                return childSchema.find({ _id: { $in: req.body.children } });
            }
        })
        .then((childrenArray) => {
            if (childrenArray.length !== req.body.children.length) {
                next(new Error(`${req.body.children.length - childrenArray.length} children not found`));
                
            }
            else {
                const newClass = new classSchema(req.body);
                return newClass.save();
            }
            
        }).then((data) => {
            res.status(200).json({ data: "new class added" });
        })
        .catch((err) => next(err));
    
    // res.status(200).json({ data: "added" });
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


    // res.status(200).json({ data: req.params });
}
exports.getClassTeacherInfo = (req, res, next) => {
    classSchema.find({ _id: req.params.id }, { _id: 0, supervisor: 1, })
        .populate({ path: "supervisor", select: { _id: 0, fullname: 1 } })
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json(data);
        })
        .catch((err) => next(err));
    // res.status(200).json({ data: req.params });
}
