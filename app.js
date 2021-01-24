const express = require('express')

const app = express()

const mongoose = require('mongoose')

const { PORT = 4000 } = process.env

require('./models/user')
require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'))

app.use(require('./routes/post'))

app.use(require('./routes/user'))

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/project', { useUnifiedTopology: true }, { useNewUrlParser: true })

mongoose.connection.on('connected', () => {
    console.log('You are now connected to Mongo')
})

mongoose.connection.on('error', (err) => {
    console.log('error connect with mongo', err)
})




app.get('/', (req, res) => {
    res.send("Hello word")
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})