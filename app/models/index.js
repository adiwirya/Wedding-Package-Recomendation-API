const dbConfig = require('../../config/db.config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url
db.paket = require('./paket.model')(mongoose)
db.criteria = require('./criteria.model')(mongoose)

module.exports = db