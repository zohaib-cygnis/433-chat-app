import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Conversation = new Schema(
    {
        user1: { type: Object },
        user2: { type: Object },
        createdBy: ObjectId,
        lastMessageAt: Date,
    },
    { timestamps: { createdAt: 'createdAt' } }
)

export default mongoose.model('Conversation', Conversation)
