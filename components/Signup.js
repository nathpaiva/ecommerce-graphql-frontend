import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION (
    $email: String!,
    $name: String!,
  	$password: String!
  ) {
    signup (
      email: $email,
      name: $name,
      password: $password,
    ) {
      id
      name
      email
      permission
    }
  }
`;

class Signup extends PureComponent {
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
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY },
        ]}
      >
        {(signup, { loading, error }) => {
          return (
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              await signup();

              this.setState({
                email: '',
                name: '',
                password: '',
              });
              Router.push('/')
            }}>
              <Error error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up for an account</h2>
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
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    name="name"
                    placeholder="name"
                    value={this.state.name}
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

                <button type="submit">Signup</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}

export default Signup;
