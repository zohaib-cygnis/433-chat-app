import bcrypt from 'bcrypt'

import { UserModel } from '../../models/'

import AppValidationError from '../../exceptions/AppValidationError'

import generateToken from '../../helpers/generate-token'

export const register = async (request, response) => {
    const { name, email, password } = request.body

    let user
    user = await UserModel.findOne({ email })

    if (user) {
        throw new AppValidationError('Email already exists.')
    }

    user = await UserModel.create({
        name,
        email,
        password: await bcrypt.hash(password.toString(), 10),
    })

    const data = await generateToken(user)

    return response.json({
        data,
    })
}
