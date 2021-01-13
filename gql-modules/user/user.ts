
import { createModule } from 'graphql-modules'
import resolvers from './userResolvers'
import typeDefs from './userTypedefs'

export const UserModule = createModule({
    id: 'user-module',
    dirname: __dirname,
    typeDefs: typeDefs,
    resolvers: resolvers,


})

