import { ConversationModel, UserModel } from '../../models/'

export const create = async (request, response) => {
    const { userId } = request.body
    const { id, name } = request.user

    let conversation = await ConversationModel.findOne({
        $or: [
            {
                'user1.id': id,
                'user2.id': userId,
            },
            {
                'user2.id': id,
                'user1.id': userId,
            },
        ],
    })

    if (!conversation) {
        const user = await UserModel.findById(userId)
        if (user) {
            conversation = await ConversationModel.create({
                user1: { id: id, name: name },
                user2: { id: userId, name: user.name },
                createdBy: id,
            })
        }
    }

    return response.json({
        data: conversation,
    })
}
