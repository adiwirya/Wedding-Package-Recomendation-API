const db = require('../models/index');
const bcrypt = require("bcrypt");
const User = db.user;

exports.register = async (req, res) =>  {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const duplicate = await User.findOne({
        email: req.body.email
    })
    if (!duplicate) {
        console.log("not duplicate");
        user.save(user)
            .then((result) => {
                res.status(200).json({
                    message: "User Created Successfully"
                });
            }).catch((err) => {
                res.status(500).json({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
    } else {
        res.status(409).json({
            message: "User already exist"
        });

    }
};

exports.login = async (req, res) => {
    await User.findOne({
        where: {
            email: req.body.email,
        }
    }).then( async(user) => {
        if (!user) {
            return res.status(401).json({
                message: "User does not exist"
            });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        if (validPassword) {
            res.status(200).json({
                message: "Login Successfully"
            });
        } else {
            res.status(400).json({
                error: "Invalid Password"
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving user."
        });
    });
};