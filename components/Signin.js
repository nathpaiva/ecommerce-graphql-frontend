import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION (
    $email: String!,
  	$password: String!
  ) {
    signin (
      email: $email,
      password: $password,
    ) {
      name
      email
      password
    }
  }
`;

class Signin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      password: '',
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
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY },
        ]}
      >
        {(signin, { loading, error }) => {
          return (
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              await signin();

              this.setState({
                email: '',
                name: '',
                password: '',
              });
            }}>
              <Error error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign into your account</h2>
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
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>

                <button type="submit">Sign In!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}

export default Signin;
