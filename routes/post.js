const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')

const multer = require('multer')

const upload = multer({ des: 'uploads/' })

const login = require('../middleware/login')

const Post = mongoose.model('post')



router.post('/crearepost', login, (req, res) => {
    const { title, body, auther } = req.body
    if (!(title || body || auther)) {
        return res.status(422).json({ error: "please add title of sbject" })
    }

    //req.user.password = undefined
    const post = new Post({
        title,
        body,
        auther,
        postedBy: req.user
    })

    post.save().then(result => {
            res.json({ post: result })
        })
        .catch(err => {
            console.log(err)
        })
})



//return  allpost
router.get('/allpost', (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})


router.get('/mypost', login, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(mypost => {
            res.json(mypost)
        })
        .catch(err => {
            console.log(err)
        })
})


router.get('/tag/:name', async(req, res, next) => {

    try {
        const tages = req.params.name;
        const tagespost = await getByTag({ title: { "$regex": title, "$options": "i" } });
        res.json(tagespost);

    } catch {

        next(e);
    }
})

router.delete('/deletepost/:postId', login, (req, res) => {
    Post.findOne({ _id: req.param.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id) {
                post.remove()
                    .then(result => {
                        res.json({ message: " successfull deleted" })
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})


module.exports = router