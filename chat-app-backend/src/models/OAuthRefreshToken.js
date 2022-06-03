import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const OAuthRefreshToken = new Schema({
    accessTokenId: ObjectId,
    revokedAt: Date,
    expiresAt: Date,
})

export default mongoose.model('OAuthRefreshToken', OAuthRefreshToken)
