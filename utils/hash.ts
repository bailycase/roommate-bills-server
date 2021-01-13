import bcrypt from 'bcryptjs'

const hash = async (string: string) => {
    const salt = bcrypt.hashSync(string)
    return salt
}

const checkHash = async (string: string, salt: string) => {
    const compare = bcrypt.compareSync(string, salt)
    return compare
}


export { hash, checkHash }