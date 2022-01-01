const db = require('../models/index')
const _ = require('lodash');
const Paket = db.paket
const Criteria = db.criteria


exports.findAll = (req, res) => {
    Paket.find()
        .then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json({
                message: err.message || "Some Error While Finding Data"
            })
        })
}

exports.create = (req, res) => {
    const paket = new Paket({
        url: req.body.url,
        nama: req.body.nama,
        harga: req.body.harga,
        venueType: req.body.venueType,
        lokasi: req.body.lokasi,
        tamu: req.body.tamu,
        image: req.body.image,
        mc: req.body.mc,
        car: req.body.car,
        photo: req.body.photo,
        video: req.body.video,
        hour: req.body.hour,
        crew: req.body.crew,
        cake: req.body.cake,
        singer: req.body.singer,
        ins: req.body.ins,
        mua: req.body.mua,
        catering: req.body.catering,
        stage: req.body.stage,
        gate: req.body.gate,
        table: req.body.table,
        groom: req.body.groom,
        bride: req.body.bride,
        live: req.body.live,
        venue: req.body.venue,
        detail: req.body.detail,
    })
    paket.save(paket)
        .then((result) => {
            res.status(200).json({
                message: "Data Created",
                paket : result,
                        })
        }).catch((err) => {
            res.status(500).json({
                message: err.message || "Some Error While Creating Data"
            })
        })
}

exports.findOne = (req, res) => {
    const id = req.params.id

    Paket.findById(id)
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: "Data Not Found"
                })
            }
            res.status(200).json(result)
        }).catch((err) => {
            res.status(409).json({
                message: err.message || "Some Error While Receiving Data"
            })
        })
}

exports.update = (req, res) => {
    const id = req.params.id

    Paket.findByIdAndUpdate(id, req.body)
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: "Data Not Found"
                })
            }
            res.status(200).json({
                message: "Data Updated",
            })
        }).catch((err) => {
            res.status(409).json({
                message: err.message || "Some Error While Updating Data"
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Paket.findByIdAndRemove(id, req.body)
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    message: "Data Not Found"
                })
            }
            res.status(200).json({
                message: "Data was Deleted",
            })
        }).catch((err) => {
            res.status(409).json({
                message: err.message || "Some Error While Deleting Data"
            })
        })
}

exports.recomendation = (req, res) => {
    const criteria = new Criteria({
        dekorasi: req.body.dekorasi,
        bridal: req.body.bridal,
        catering: req.body.catering,
        dokumentasi: req.body.dokumentasi,
        venue: req.body.venue,
        entertaiment: req.body.entertaiment,
        jumlahTamu: req.body.jumlahTamu,
        totalHarga: req.body.totalHarga,
        car : req.body.car,
        cake: req.body.cake,
        crew: req.body.crew,
        live : req.body.live,
    })
    Paket.find()
        .then((result) => {
            const paket = _.map(result, (value) =>  createdata(value))
            const MaxMin = getMinMax(paket)
            const normalisasiNilai = _.map(paket, nilai => normalisasi(nilai, MaxMin));
            const hitungBobotPeringkat = _.map(normalisasiNilai, nilai => hitungPeringkat(nilai, criteria));
            const Rank = _.orderBy(hitungBobotPeringkat, ['total'], ['desc'])
            res.status(200).json(_.slice(Rank, 0, 5))
        }).catch((err) => {
            res.status(500).json({
                message: err.message || "Some Error While Finding Data"
            })
        })
}

function createdata(data) {
    result = {
        id : data.id,
        url: data.url,
        nama: data.nama,
        harga: data.harga,
        totalHarga: data.harga,
        venueType: data.venueType,
        lokasi: data.lokasi,
        jumlahTamu: data.tamu,
        image: data.image,
        katering: data.catering,
        venue: data.venue,
        car: data.car,
        crew: data.crew,
        cake: data.cake,
        live: data.live,
        entertaiment: (Number(data.mc) + Number(data.singer) + Number(data.ins)),
        bridal: (Number(data.mua) + Number(data.groom) + Number(data.bride)),
        dokumentasi: ((Number(data.photo) + Number(data.video)) * Number(data.hour)),
        dekorasi: (Number(data.stage) + Number(data.gate) + Number(data.table)),
        detail: data.detail,
    }
    // console.log(result);
    return result;

}

function getMinMax(value) {
    // console.log(value);
    const dekorasiMax = _.maxBy(value, 'dekorasi')
    const bridalMax = _.maxBy(value, 'bridal')
    const kateringMax = _.maxBy(value, 'katering')
    const dokumentasiMax = _.maxBy(value, 'dokumentasi')
    const entertaimentMax = _.maxBy(value, 'entertaiment')
    const venueMax = _.maxBy(value, 'venue')
    const jumlahTamuMax = _.maxBy(value, 'jumlahTamu')
    const totalHargaMin = _.minBy(value, 'totalHarga')
    const carMax = _.maxBy(value, 'car')
    const cakeMax = _.maxBy(value, 'cake')
    const crewMax = _.maxBy(value, 'crew')
    const liveMax = _.maxBy(value, 'live')


    return {
        dekorasi: dekorasiMax.dekorasi,
        bridal: bridalMax.bridal,
        katering: kateringMax.katering,
        dokumentasi: dokumentasiMax.dokumentasi,
        entertaiment: entertaimentMax.entertaiment,
        venue: venueMax.venue,
        jumlahTamu: jumlahTamuMax.jumlahTamu,
        totalHarga: totalHargaMin.totalHarga,
        car: carMax.car,
        cake: cakeMax.cake,
        crew: crewMax.crew,
        live: liveMax.live,
    }
}

function normalisasi(matrix, maxmin) {
    if (matrix.dokumentasi != '0') {
        matrix.dokumentasi = maxmin.dokumentasi / matrix.dokumentasi;
    }

    if (matrix.entertaiment != '0') {
        matrix.entertaiment = maxmin.entertaiment / matrix.entertaiment;
    }

    if (matrix.dekorasi != '0') {
        matrix.dekorasi = maxmin.dekorasi / matrix.dekorasi;
    }

    if (matrix.bridal != '0') {
        matrix.bridal = maxmin.bridal / matrix.bridal;
    }

    if (matrix.katering != '0') {
        matrix.katering = maxmin.katering / matrix.katering;
    }

    if (matrix.venue != '0') {
        matrix.venue = maxmin.venue / matrix.venue;
    }

    if (matrix.jumlahTamu != '0') {
        matrix.jumlahTamu = matrix.jumlahTamu / maxmin.jumlahTamu;
    }

    if (matrix.totalHarga != '0') {
        matrix.totalHarga = maxmin.totalHarga / matrix.totalHarga;
    }

    if (matrix.car != '0') {
        matrix.car = maxmin.car / matrix.car;
    }

    if (matrix.cake != '0') {
        matrix.cake = maxmin.cake / matrix.cake;
    }

    if (matrix.crew != '0') {
        matrix.crew = maxmin.crew / matrix.crew;
    }

    if (matrix.live != '0') {
        matrix.live = maxmin.live / matrix.live;
    }

    return matrix;
}

function hitungPeringkat(nilai, criteria) {
    const total =
        (nilai.dekorasi * criteria.dekorasi) +
        (nilai.bridal * criteria.bridal) +
        (nilai.dokumentasi * criteria.dokumentasi) +
        (nilai.entertaiment * criteria.entertaiment) +
        (nilai.venue * criteria.venue) +
        (nilai.jumlahTamu * criteria.jumlahTamu) +
        (nilai.totalHarga * criteria.totalHarga) +
        (nilai.car * criteria.car) +
        (nilai.cake * criteria.cake) +
        (nilai.crew * criteria.crew) +
        (nilai.live * criteria.live) +
        (nilai.katering * criteria.catering);
    
    result = {
        id: nilai.id,
        nama: nilai.nama,
        image: nilai.image,
        harga: nilai.harga,
        total: total,
    }
    return result;
}