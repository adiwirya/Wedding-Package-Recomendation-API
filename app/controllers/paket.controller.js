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
            const hitungBobotPeringkat = _.map(normalisasiNilai, nilai => hitungPeringkat(nilai,criteria));
            res.send(_.orderBy(hitungBobotPeringkat,['total'],['desc']))
        }).catch((err) => {
            res.status(500).send({
            message : err.message || "Some Error While Finding Data"
        })
    })
}

function getMinMax(value) {

    const dekorasi = _.min(value, 'dekorasi')
    const makeup = _.min(value, 'makeup')
    const katering = _.min(value, 'katering')
    const dokumentasi = _.min(value, 'dokumentasi')
    const entertaiment = _.min(value, 'entertaiment')
    const venue = _.min(value, 'venue')
    const jumlahTamu = _.max(value, 'jumlahTamu')
    const totalHarga = _.min(value, 'totalHarga')

  return {
        dekorasi: dekorasi.dekorasi,
        makeup: makeup.makeup,
        katering: katering.katering,
        dokumentasi: dokumentasi.dokumentasi,
        entertaiment: entertaiment.entertaiment,
        venue: venue.venue,
        jumlahTamu: jumlahTamu.jumlahTamu,
        totalHarga: totalHarga.totalHarga,
  }
}

function normalisasi(matrix, maxmin) {
  matrix.dekorasi = maxmin.dekorasi / matrix.dekorasi;
  matrix.makeup = matrix.makeup / maxmin.makeup;
  matrix.katering = matrix.katering / maxmin.katering;
  matrix.dokumentasi = matrix.dokumentasi / maxmin.dokumentasi;
  matrix.entertaiment = matrix.entertaiment /maxmin.entertaiment;
  matrix.venue = matrix.venue /maxmin.venue;
  matrix.jumlahTamu = matrix.jumlahTamu /maxmin.jumlahTamu;
  matrix.totalHarga = matrix.totalHarga /maxmin.totalHarga;

  return matrix;
}

function hitungPeringkat(nilai, criteria) {
    const total =
        (nilai.dekorasi * criteria.dekorasi) +
        (nilai.makeup * criteria.makeup) +
        (nilai.katering * criteria.katering) +
        (nilai.dokumentasi * criteria.dokumentasi) +
        (nilai.entertaiment * criteria.entertaiment);
        (nilai.venue * criteria.venue);
        (nilai.jumlahTamu * criteria.jumlahTamu);
        (nilai.total * criteria.total);
  const result = {
  nama: nilai.namaPaket,
    total: total
  }
  return result;
}