import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const OAuthToken = new Schema({
    userId: ObjectId,
    revokedAt: Date,
    expiresAt: Date,
})

export default mongoose.model('OAuthToken', OAuthToken)
