import { createModule } from 'graphql-modules'
import resolvers from './authResolvers'
import typeDefs from './authTypedefs'

export const AuthenticationModule = createModule({
    id: 'authentication-module',
    dirname: __dirname,
    typeDefs: typeDefs,
    resolvers: resolvers,
})

