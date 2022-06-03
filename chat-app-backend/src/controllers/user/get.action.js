import { UserModel } from '../../models'

export const get = async (request, response) => {
    const users = await UserModel.find({ _id: { $ne: request.user.id } }).sort({
        createdAt: -1,
    })

    return response.json({
        data: users,
    })
}
