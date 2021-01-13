import fetchHabits from '../../gql-modules/habits/requests/fetchHabits'
import Me from './requests/me'
export default {
    Query: {
        me: Me
    }
}