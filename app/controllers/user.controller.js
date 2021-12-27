const db = require('../models/index');
var md5 = require('md5');
const userModel = require('../models/user.model');
const User = db.user;

exports.register = async (req, res) =>  {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    })
    
    user.password = await md5(user.password);
    const duplicate = await User.findOne({
        email: req.body.email
    })
    if (!duplicate) {
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
    try {
        const user = await User.findOne({
        email: req.body.email,
    })
    console.log(user);
    if (user != null) {
        const data = new User({
            email: user.email,
            password: user.password,
        })
        var pass = await md5(req.body.password);
        if (data.password == pass) {
            res.status(200).json({
                message: "Login Success",
            });
        }
        else {
            res.status(401).json({
                message: "Login Failed",
            });
        }
     } else {
        res.status(409).json({
            message: "User does not exist"
        });

    }
    } catch (error) {
        res.status(500).json({
            message: error.message || "Some error occurred while creating the User."
        });
    }

};