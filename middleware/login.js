const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../key')

const mongoose = require('mongoose')

const User = mongoose.model("User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "create new account" })
    }

    const token = authorization.replace("ok ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "create new1 account" })
        }
        const { _id } = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
        })
        next()
    })
}