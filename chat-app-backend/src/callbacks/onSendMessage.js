import { MessageModel } from '../models'

export default async (socket, data) => {
    const { conversationId, receiverId, receiverName, text } = data

    await MessageModel.create({
        conversationId,
        receiverId,
        receiverName,
        text,
        senderId: socket.user._id,
        senderName: socket.user.name,
    })

    await socket.broadcast.to(`user-${receiverId}`).emit('receiveMessage', {
        conversationId,
        receiverId,
        receiverName,
        text,
        senderId: socket.user._id,
        senderName: socket.user.name,
    })
}
