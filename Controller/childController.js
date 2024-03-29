const childSchema = require("../Model/childModel");
const classSchema = require("../Model/classModel");
exports.getAllChildren = (req, res, next) => {
    childSchema.find()
        .then((data) => res.status(200).json(data))
        .catch((err) => next(err));
    
    
    // res.status(200).json({ data: [] });
};

exports.getChildById = (req, res, next) => {
    const id = req.params.id;
    childSchema.findById(id)
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Child not found" });
            }
            res.status(200).json(data);
        })
        .catch((err) => next(err));


    // res.status(200).json({ data: req.params });
};

exports.insertChild = (req, res, next) => {
    const child = new childSchema(req.body);
    child.save()
        .then((data) => {
            res.status(200).json({ data: "new child added" });
        })
        .catch((err) => next(err));

    // res.status(200).json({ data: "added" });
};

exports.updateChild = (req, res, next) => {
    const id = req.body._id;
    childSchema.findByIdAndUpdate(id, req.body, { new: true })
        .then((data) => {
            if (!data) {
                res.status(404).json({ message: "Child not found" });
            }
            res.status(200).json({ data: "updated" });
        })
        .catch((err) => next(err));
    // res.status(200).json({ data: "updated" });
};

exports.deleteChild = async(req, res, next) => {
    try {
        const id = req.params.id;
        const classOfChild = await classSchema.findOne({ children: id });
        classOfChild.children.pull(id);
        await classOfChild.save();
        childSchema.findByIdAndDelete(id)
            .then((data) => {
                if (!data) {
                    res.status(404).json({ message: "Child not found" });
                }
                res.status(200).json({ data: "deleted" });
            })
            
    } catch (error) {
        next(error);
    }
    

};

