const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')
const login = require('../middleware/login')
const Post = mongoose.model('post')

const User = mongoose.model('User')

router.get('/user/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")

        }).catch(err => {
            return res.status(404).json({ error: "NOT FOUND" })
        })
})

//follow
router.put('follow', login, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, { new: true },
        (err, reslut) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            User.findOneAndUpdate(req.user._id, {
                $push: { following: req.body.followId }
            }, { new: true }).select("-password").then(reault => {
                res.json(reault)
            }).catch(err => {
                return res.status(422).json({ error: err })
            })
        })
})


//unfollow
router.put('unfollow', login, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
            $pull: { followers: req.user._id }
        }, { new: true },
        (err, reslut) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            User.findOneAndUpdate(req.user._id, {
                $pull: { following: req.body.unfollowId }
            }, { new: true }).select("-password").then(reault => {
                res.json(reault)
            }).catch(err => {
                return res.status(422).json({ error: err })
            })
        })
})

router.post('/search-user', (req, res) => {
    let userPatter = new RegExp("^" + req.body.query)
    User.find({ email: { $regex: userPatter } })
        .select("_id email")
        .then(user => {
            res.json({ user })
        }).catch(err => {
            console.log(err)
        })
})



module.exports = router