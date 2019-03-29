import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Error from './ErrorMessage';

const ALL_USERS_QUERY = gql`
  query USERS {
    users {
      id
      name
      permission
    }
  }
`;

const Permission = props => (
  <Query query={ALL_USERS_QUERY}>
    {({data, loading, error}) => {
      if (loading) return <div>Loading...</div>
      if (error) return <Error error={error} />

      return <p>Hello!</p>
    }}
  </Query>
);

export default Permission;
