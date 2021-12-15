module.exports = (mongoose) => {
    const UserSchema = mongoose.Schema(
        {
            email: String,
            password: String,
            name: String,
            role: String
        },
        { timestamps: true }
    )
    UserSchema.method("toJSON", function () {
            const { __v, _id, ... object } = this.toObject()
            object.id = _id
            return object
    })
    
    const User = mongoose.model("User", UserSchema)
    return User
}
