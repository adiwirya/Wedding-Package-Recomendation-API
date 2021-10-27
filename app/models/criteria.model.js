module.exports = (mongoose) => {
    const schema = mongoose.Schema(
        {
            dekorasi: Number,
            makeup: Number,
            katering: Number,
            dokumentasi: Number,
            venue: Number,
            entertaiment: Number,
            jumlahTamu: Number,
            totalHarga: Number,
        },

        { timestamps : true}

    )
    schema.method("toJSON", function () {
            const { __v, _id, ... object } = this.toObject()
            object.id = _id
            return object
    })
    
    const Paket = mongoose.model("Criteria", schema)
    return Paket
}