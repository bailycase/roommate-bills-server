import registerUser from './requests/registerUser'
import loginUser from './requests/loginUser'

export default {
    Mutation: {
        register: registerUser,
        login: loginUser
    }
}