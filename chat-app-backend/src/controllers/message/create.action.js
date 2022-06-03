import { MessageModel } from '../../models/'

export const create = async (request, response) => {
    const { id, name } = request.user
    const { receiverId, text } = request.body

    const message = await MessageModel.create({
        receiverId,
        receiverName: 'receiverName',
        senderId: id,
        senderName: name,
        text,
    })

    return response.json({
        data: message,
    })
}
