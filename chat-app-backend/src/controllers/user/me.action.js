import { UserModel } from '../../models'

export const me = async (request, response) => {
    const user = await UserModel.findOne({ _id: request.user.id })

    return response.json({
        data: user,
    })
}
