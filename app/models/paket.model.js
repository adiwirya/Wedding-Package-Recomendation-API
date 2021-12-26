module.exports = (mongoose) => {
    const Paketschema = mongoose.Schema(
        {
            url : String,
            nama: String,
            harga: Number,
            venueType: String,
            lokasi: String,
            tamu: Number,
            image: String,
            mc: Number,
            car: Number,
            photo: Number,
            video: Number,
            hour: Number,
            crew: Number,
            cake: Number, 
            singer: Number,
            ins: Number,
            mua: Number,
            catering: Number,
            stage: Number,
            gate: Number,
            table: Number,
            groom: Number,
            bride: Number,
            live: Number,
            venue: Number,
            detail: String,
        },

        { timestamps : true}

    )
    Paketschema.method("toJSON", function () {
            const { __v, _id, ... object } = this.toObject()
            object.id = _id
            return object
    })
    
    const Paket = mongoose.model("Paket", Paketschema)
    return Paket
}