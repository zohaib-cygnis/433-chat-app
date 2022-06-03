import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'

import { TokenModel, RefreshTokenModel } from '../models'

export default async (user) => {
    // number of seconds in a day
    const secondsInADay = 24 * 60 * 60

    // set token expiration based on remember me
    const tokenExpirationDate = dayjs().add(1, 'days')

    // Store the access token to the database
    const accessTokenInstance = await TokenModel.create({
        userId: user._id,
        revokedAt: null,
        expiresAt: tokenExpirationDate,
    })

    // Store the refresh token to the database
    const refreshTokenInstance = await RefreshTokenModel.create({
        accessTokenId: accessTokenInstance._id,
        revokedAt: null,
        expiresAt: tokenExpirationDate,
    })

    // generate jwt to access token
    const accessToken = jwt.sign(
        {
            id: accessTokenInstance._id,
            userId: user._id,
            clientId: process.env.CLIENT_ID,
        },
        process.env.CLIENT_SECRET,
        {
            expiresIn: 1 * secondsInADay,
        }
    )

    // generate jwt to refresh token
    const refreshToken = jwt.sign(
        {
            id: refreshTokenInstance._id,
            userId: user._id,
            clientId: process.env.CLIENT_ID,
        },
        process.env.CLIENT_SECRET,
        {
            expiresIn: 1 * secondsInADay,
        }
    )

    return {
        accessToken,
        refreshToken,
        tokenExpirationDate,
        id: user._id,
    }
}
