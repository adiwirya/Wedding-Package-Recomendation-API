module.exports = (app) => {
    const paket = require('../controllers/paket.controller')
    const router = require('express').Router()
    const multer = require('multer');
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './images')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            // cb(new Error('File harus berupa jpg/png'));
            cb(null, false);
        }
    };


    const upload = multer({
        storage: storage, limits:
        {
            fileSize: 1024 * 1024 * 5,
        },
        fileFilter: fileFilter
    });


    router.post('/rec/', paket.recomendation)
    router.get('/', paket.findAll)
    router.post('/',upload.single('image') , paket.create)
    router.get('/:id', paket.findOne)
    router.put('/:id', paket.update)
    router.delete('/:id', paket.delete)
    

    app.use('/api/paket/', router)
} 