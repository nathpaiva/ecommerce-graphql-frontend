import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION (
    $email: String!
  ) {
    requestReset (
      email: $email
    ) {
      message
    }
  }
`;

class RequestReset extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
    this.saveToState = this.saveToState.bind(this);
  }

  saveToState(evt) {
    const { name, value } = evt.target;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
      >
        {(requestReset, { loading, error, called }) => {
          return (
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              await requestReset();

              this.setState({
                email: '',
              });
            }}>
              <Error error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a password reset</h2>
                {!error && !loading && called && <p>Sucess! Check your email for a reset link!</p>}
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Request Reset!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
