import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Message = new Schema(
    {
        conversationId: ObjectId,
        receiverId: ObjectId,
        receiverName: String,
        senderId: ObjectId,
        senderName: String,
        text: String,
    },
    { timestamps: { createdAt: 'createdAt' } }
)

export default mongoose.model('Message', Message)
