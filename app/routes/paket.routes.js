module.exports = (app) => {
    const paket = require('../controllers/paket.controller')
    const router = require('express').Router()

    router.post('/rec/', paket.recomendation)
    router.get('/', paket.findAll)
    router.post('/', paket.create)
    router.get('/:id', paket.findOne)
    router.put('/:id', paket.update)
    router.delete('/:id', paket.delete)
    

    app.use('/api/paket/', router)
}