import { MessageModel } from '../../models'

export const get = async (request, response) => {
    const messages = await MessageModel.find({
        conversationId: request.query.conversationId,
    })

    return response.json({
        data: messages,
    })
}
