const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')

const User = mongoose.model("User")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const { JWT_SECRET } = require("../key")

const login = require('../middleware/login')


router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the data" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user Already exists with that email" })
            }

            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "save is successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })

        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/signin', (req, res) => {
    const { email, password } = req.body

    if (!(email || password)) {
        return res.status(422).json({ error: "please enter password and email" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "not correct email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({ massage: "successfully signin" })

                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email } = savedUser
                        res.json({ token, user: { _id, name, email } })
                    } else {
                        return res.status(422).json({ error: "not correct  password" })
                    }

                })
                .catch(err => {
                    console.log(err)
                })
        })

})
module.exports = router