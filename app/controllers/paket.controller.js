const db = require('../models/index')
const _ = require('lodash');
const Paket = db.paket
const Criteria = db.criteria


exports.findAll = (req, res) => {
    Paket.find()
        .then((result) => {
        res.send(result)
        }).catch((err) => {
            res.status(500).send({
            message : err.message || "Some Error While Finding Data"
        })
    })
}

exports.create = (req, res) => {
    const paket = new Paket({
        namaPaket: req.body.namaPaket,
        dekorasi: req.body.dekorasi,
        makeup: req.body.makeup,
        katering: req.body.katering,
        dokumentasi: req.body.dokumentasi,
        entertaiment: req.body.entertaiment,
        venue: req.body.venue,
        jumlahTamu: req.body.jumlahTamu,
        totalHarga: req.body.totalHarga,
        image: req.file.path,
    })

    paket.save(paket)
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

    Paket.findById(id)
        .then((result) => {
            if (!result) {
                res.status(404).send({
                    message: "Data Not Found"
                })
            }
            res.send(result)
        }).catch((err) => {
            res.status(409).send({
                message: err.message || "Some Error While Receiving Data"
            })
        })
}

exports.update = (req, res) => {
    const id = req.params.id

    Paket.findByIdAndUpdate(id, req.body)
        .then((result) => {
            if (!result) {
                res.status(404).send({
                    message: "Data Not Found"
                })
            }
                res.send({
                    message: "Data Updated",
              })  
        }).catch((err) => {
         res.status(409).send({
                message: err.message || "Some Error While Updating Data"
            })
    }) 
}

exports.delete = (req, res) => {
    const id = req.params.id

    Paket.findByIdAndRemove(id, req.body)
        .then((result) => {
            if (!result) {
                res.status(404).send({
                    message: "Data Not Found"
                })
            }
                res.send({
                    message: "Data was Deleted",
                    data : result,
              })  
        }).catch((err) => {
         res.status(409).send({
                message: err.message || "Some Error While Deleting Data"
            })
    }) 
}

exports.recomendation = (req, res) => {
    const criteria = new Criteria({
        dekorasi: req.body.dekorasi,
        makeup: req.body.makeup,
        katering: req.body.katering,
        dokumentasi: req.body.dokumentasi,
        entertaiment: req.body.entertaiment,
        venue: req.body.venue,
        jumlahTamu: req.body.jumlahTamu,
        totalHarga: req.body.totalHarga,
    }) 

    Paket.find()
        .then((result) => {
            const paket = result
            const MaxMin = getMinMax(paket)
            const normalisasiNilai = _.map(paket, nilai => normalisasi(nilai, MaxMin));
            const hitungBobotPeringkat = _.map(normalisasiNilai, nilai => hitungPeringkat(nilai, criteria));
            const Rank = _.orderBy(hitungBobotPeringkat,['total'],['desc'])
            res.send(_.slice(Rank,0,3))
            // console.log(MaxMin);
            // res.send(hitungBobotPeringkat)
        }).catch((err) => {
            res.status(500).send({
            message : err.message || "Some Error While Finding Data"
        })
    })
}

function getMinMax(value) {
    const dekorasiMin = _.minBy(value, 'dekorasi')
    const makeupMin = _.minBy(value, 'makeup')
    const kateringMin = _.minBy(value, 'katering')
    const dokumentasiMin = _.minBy(value, 'dokumentasi')
    const entertaimentMin = _.minBy(value, 'entertaiment')
    const venueMin = _.minBy(value, 'venue')
    const jumlahTamuMax = _.maxBy(value, 'jumlahTamu')
    const totalHargaMin = _.minBy(value, 'totalHarga')

  return {
        dekorasi: dekorasiMin.dekorasi,
        makeup: makeupMin.makeup,
        katering: kateringMin.katering,
        dokumentasi: dokumentasiMin.dokumentasi,
        entertaiment: entertaimentMin.entertaiment,
        venue: venueMin.venue,
        jumlahTamu: jumlahTamuMax.jumlahTamu,
        totalHarga: totalHargaMin.totalHarga,
  }
}

function normalisasi(matrix, maxmin) {
    if (matrix.dokumentasi != '0')
    { matrix.dokumentasi = maxmin.dokumentasi / matrix.dokumentasi; }
    
    if (matrix.entertaiment != '0')
    { matrix.entertaiment = maxmin.entertaiment / matrix.entertaiment; }

    if (matrix.dekorasi != '0')
    { matrix.dekorasi = maxmin.dekorasi / matrix.dekorasi; }

    if (matrix.makeup != '0')
    { matrix.makeup = maxmin.makeup / matrix.makeup; }
    
    if (matrix.katering != '0')
    { matrix.katering = maxmin.katering / matrix.katering; }
    
    if (matrix.venue != '0')
    { matrix.venue = maxmin.venue / matrix.venue; }
    
    if (matrix.jumlahTamu != '0')
    { matrix.jumlahTamu = matrix.jumlahTamu / maxmin.jumlahTamu; }
    
    if (matrix.totalHarga != '0')
    { matrix.totalHarga = maxmin.totalHarga / matrix.totalHarga; }
    
  return matrix;
}

function hitungPeringkat(nilai, criteria) {
    const total =
        (nilai.dekorasi * criteria.dekorasi) +
        (nilai.makeup * criteria.makeup) +
        (nilai.katering * criteria.katering) +
        (nilai.dokumentasi * criteria.dokumentasi) +
        (nilai.entertaiment * criteria.entertaiment) +
        (nilai.venue * criteria.venue) +
        (nilai.jumlahTamu * criteria.jumlahTamu)+
        (nilai.totalHarga * criteria.totalHarga);
    const result = {
        id: nilai.id,
        nama: nilai.namaPaket,
        image: nilai.image,
        total: total,
    }
  return result;
}