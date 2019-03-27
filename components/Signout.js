import React from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SINGOUT_MUTATION = gql`
  mutation SINGOUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = props => (
  <Mutation mutation={SINGOUT_MUTATION} refetchQueries={[
    { query: CURRENT_USER_QUERY },
  ]}>
    {(signout) => (
      <button onClick={signout}>
        Sign Out
      </button>
    )}
  </Mutation>
);

export default Signout;
