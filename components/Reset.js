import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION (
    $resetPassword: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword (
      resetPassword: $resetPassword
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class Reset extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmPassword: '',
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
        mutation={RESET_MUTATION}
        variables={{
          ...this.state,
          resetPassword: this.props.resetToken,
        }}
        refetchQueries={[
          { query: CURRENT_USER_QUERY },
        ]}
      >
        {(resetPassword, { loading, error }) => {
          return (
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              const teste = await resetPassword();
							console.log("TCL: Reset -> render -> teste", teste);

              this.setState({
                password: '',
                confirmPassword: '',
              });

              Router.push('/');
            }}>
              <Error error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset password</h2>
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
                <label htmlFor="confirmPassword">
                  Confirm Password
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.saveToState}
                  />
                </label>

                <button type="submit">Reset your password!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}

export default Reset;
