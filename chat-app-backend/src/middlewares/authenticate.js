import jwt from 'jsonwebtoken'
import passport from 'passport'
import BearerStrategy from 'passport-http-bearer'
import { TokenModel, UserModel } from '../models'

// token verification
passport.use(
    new BearerStrategy(
        {
            passReqToCallback: true,
        },
        async (request, token, done) => {
            // if token is not given return
            if (!token) {
                return done(null, false)
            } else {
                try {
                    // verify token with secret
                    // and retrieve token payload
                    const payload = await jwt.verify(
                        token,
                        process.env.CLIENT_SECRET
                    )
                    // Check if the token is not revoked
                    const accessToken = await TokenModel.findById(payload.id)

                    if (!accessToken || !!accessToken.revokedAt) {
                        // Unauthenticated if access token not in database
                        // or the access token has been revoked
                        return done(null, false)
                    }

                    // retrieve user from payload
                    const user = await UserModel.findById(payload.userId)
                    delete user.password

                    // return user with token data to
                    // callback function for current route
                    return done(null, user, accessToken)
                } catch (error) {
                    return done(null, false)
                }
            }
        }
    )
)
export default passport.authenticate('bearer', {
    session: false,
})
