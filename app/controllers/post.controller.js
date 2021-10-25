const db = require('../models/index')
const Post = db.posts

exports.findAll = (req, res) => {
    Post.find()
        .then((result) => {
        res.send(result)
        }).catch((err) => {
            res.status(500).send({
            message : err.message || "Some Error While Receiving Data"
        })
    })
}

exports.create = (req, res) => {
    const post = new Post({
        title : req.body.title,
        body: req.body.body,
        published : req.body.published ? req.body.published : false
    })

    post.save(post)
        .then((result) => {
        res.send(result)
        }).catch((err) => {
            res.status(409).send({
            message : err.message || "Some Error While Creating Data"
        })
    })
}

exports.findOne = (req, res) => {
    const id = req.params.id

    Post.findById(id)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(409).send({
                message: err.message || "Some Error While Receiving Data"
            })
        })
}

exports.update = (req, res) => {
    const id = req.params.id

    Post.findByIdAndUpdate(id, req.body)
        .then((result) => {
            if (!result) {
                res.status(404).send({
                    message: "Post Not Found"
                })
            }
                res.send({
                    message: "Post Updated",
                    data : result,
              })  
        }).catch((err) => {
         res.status(409).send({
                message: err.message || "Some Error While Updating Data"
            })
    }) 
}

exports.delete = (req, res) => {
    const id = req.params.id

    Post.findByIdAndRemove(id, req.body)
        .then((result) => {
            if (!result) {
                res.status(404).send({
                    message: "Post Not Found"
                })
            }
                res.send({
                    message: "Post was Deleted",
                    data : result,
              })  
        }).catch((err) => {
         res.status(409).send({
                message: err.message || "Some Error While Deleting Data"
            })
    }) 
}