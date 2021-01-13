import { createApplication } from 'graphql-modules';
import { AuthenticationModule } from './authentication/authentication';
import { UserModule } from './user/user';

export const ModuleApplication = createApplication({
  modules: [AuthenticationModule, UserModule],
});
