const childSchema = require("../Model/childModel");
const classSchema = require("../Model/classModel");
const fs = require("fs");
exports.getAllChildren = (req, res, next) => {
    childSchema.find()
        .then((data) => res.status(200).json(data))
        .catch((err) => next(err));
    
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


};


exports.insertChild = async (req, res, next) => {
    try {
        const { fullName, age, level, address } = req.body;
        if (req.file) {
            // Constructing the image filename using template literals
            req.body.image = `${new Date().toLocaleDateString().replace(/\//g, '-')}-${req.file.originalname}`;
            fs.writeFile(`./images/children/${req.body.image}`, req.file.buffer, (err) => {
                if (err) return next(err);
            });
        }
        // Check if the child already exists in the database
        const existingChild = await childSchema.findOne({ fullName });
        if (existingChild) {
            return res.status(400).json({ message: "child already exists, please use another name" });
        }
        // Create a new child instance
        const child = new childSchema({
            fullName,
            age,
            image: req.body.image,
            level,
            address
        });

        // Save the child to the database
        await child.save();

        res.status(200).json({ data: "new child added" });
    } catch (err) {
        next(err);
    }
};


exports.updateChild = async (req, res, next) => {
    try {
        const id = req.body._id;
        if (req.file) {
            // Constructing the image filename using template literals
            req.body.image = `${new Date().toLocaleDateString().replace(/\//g, '-')}-${req.file.originalname}`;
            fs.writeFile(`./images/children/${req.body.image}`, req.file.buffer, (err) => {
                if (err) return next(err);
            });
        }
        // Find the child by ID and update its data
        const updatedChild = await childSchema.findByIdAndUpdate(id, req.body, { new: true });

        // If child is not found, return 404 status
        if (!updatedChild) {
            return res.status(404).json({ message: "Child not found" });
        }

        // If child is updated successfully, return 200 status
        res.status(200).json({ data: "updated" });
    } catch (err) {
        next(err); // Pass any error to the error handling middleware
    }
};


exports.deleteChild = async(req, res, next) => {
    try {
        const id = req.params.id;
        const classOfChild = await classSchema.findOne({ children: id });
        if (classOfChild) {
            classOfChild.children.pull(id);
            await classOfChild.save();
        }
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
