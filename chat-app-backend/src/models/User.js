import mongoose from 'mongoose'

const Schema = mongoose.Schema

const User = new Schema(
    {
        email: String,
        name: String,
        password: String,
    },
    { timestamps: { createdAt: 'createdAt' } }
)

export default mongoose.model('User', User)
