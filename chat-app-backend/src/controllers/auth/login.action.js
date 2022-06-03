import bcrypt from 'bcrypt'

import { UserModel } from '../../models/'

import generateToken from '../../helpers/generate-token'

export const login = async (request, response) => {
    const { email, password } = request.body

    const user = await UserModel.findOne({ email })

    let data
    if (user) {
        // check password for the user
        if (bcrypt.compareSync(password, user.password)) {
            // generate tokens
            data = await generateToken(user)
        }
    } else {
        // send response if the user is pending or not activated
        return response.status(404).json({
            message: 'Invalid credentials',
        })
    }

    return response.json({
        data,
    })
}
