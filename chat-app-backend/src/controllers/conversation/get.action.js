import { ConversationModel } from '../../models/'

export const get = async (request, response) => {
    const { id } = request.user

    const messages = await ConversationModel.find({
        $or: [
            {
                'user1.id': id,
            },
            {
                'user2.id': id,
            },
        ],
    })

    return response.json({
        data: messages,
    })
}
