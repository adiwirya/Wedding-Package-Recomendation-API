const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use('/images', express.static('images'))
const db = require('./app/models/index')

db.mongoose
    .connect(db.url, {
        // useNewUrlParser: true,
        // useUnifiedTopology : true,
    })
    .then(() => {
        console.log('Database Connected!')
    }).catch((err) => {
        console.log('Cannot connect to the database!', err)
        process.exit()
    })



app.get('/', (req, res) => {
    res.json({
        message: "Welcome To SPK SAW API"
    })
})

require('./app/routes/paket.routes')(app)
require('./app/routes/user.routes')(app)


app.listen(process.env.PORT, () => {
    console.log('Server is running on http://localhost:' + process.env.PORT)
})