const db = require('../models/index');
var md5 = require('md5');
var bcrypt = require('bcrypt');
const User = db.user;



exports.register = async (req, res) =>  {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const duplicate = await User.findOne({
        email: req.body.email
    })
    if (!duplicate) {
        user.save(user)
            .then((result) => {
                res.status(200).json({
                    message: "User Berhasil Dibuat"
                });
            }).catch((err) => {
                res.status(500).json({
                    message: err.message || "Terjadi Kesalahan"
                });
            });
    } else {
        res.status(409).json({
            message: "User Sudah terdaftar"
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
         const validPassword = await bcrypt.compare(req.body.password, data.password);
        
        if (validPassword) {
            res.status(200).json({
                message: "Login Berhasil"
            });
        } else {
            res.status(400).json({
                message: "Login Gagal"
            });
        }
     } else {
        res.status(409).json({
            message: "User Tidak Ditemukan"
        });

    }
    } catch (error) {
        res.status(500).json({
            message: error.message || "Terjadi Kesalahan"
        });
    }
};




