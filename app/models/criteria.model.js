module.exports = (mongoose) => {
    const Criteriaschema = mongoose.Schema(
        {
            dekorasi: Number,
            bridal: Number,
            catering: Number,
            dokumentasi: Number,
            venue: Number,
            entertaiment: Number,
            jumlahTamu: Number,
            totalHarga: Number,
            car: Number,
            cake: Number,
            crew: Number,
            live: Number,
        },

        { timestamps : true}

    )
    Criteriaschema.method("toJSON", function () {
            const { __v, _id, ... object } = this.toObject()
            object.id = _id
            return object
    })
    
    const Criteria = mongoose.model("Criteria", Criteriaschema)
    return Criteria
}