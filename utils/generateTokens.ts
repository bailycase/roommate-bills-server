import { sign } from 'jsonwebtoken'
import { ObjectID } from 'mongodb'

interface User {
    _id: ObjectID;
    email: string;
    password: string;
}

export const generateTokens = (user: User) => {
    const refreshToken = sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    })
    const accessToken = sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, {
        expiresIn: '15min'
    })

    return { refreshToken, accessToken }
}