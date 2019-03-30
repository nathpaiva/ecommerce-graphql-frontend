import React, { PureComponent } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Error from './ErrorMessage';
import Table from './styles/Table'
import SickButton from './styles/SickButton'

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const ALL_USERS_QUERY = gql`
  query USERS {
    users {
      id
      name
      email
      permission
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions (
      $permission: [Permission]
      $userId: ID!
    ) {
    updatePermissions (
      permission: $permission
      userId: $userId
    ) {
      id
      name
      email
      permission
    }
  }
`;

const Permission = props => (
  <Query query={ALL_USERS_QUERY}>
    {({data, loading, error}) => (
      <>
        <Error error={error} />
        {!error && (
          <>
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map((permission, index) => <th key={index}>{permission}</th>)}
                  <th>👇</th>
                </tr>
              </thead>
              <tbody>
                {!data && data.users.map(user => <UserPermission user={user} key={user.id} />)}
              </tbody>
            </Table>
          </>
        )}
      </>
    )}
  </Query>
);

class UserPermission extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      permissions: this.props.user.permission
    }
    this.handlePermissionChange = this.handlePermissionChange.bind(this);
  }

  handlePermissionChange(env) {
    const checkbox = env.target;
    let updatePermissions = [...this.state.permissions];

    if (checkbox.checked) {
      updatePermissions.push(checkbox.value);
    }

    if (!checkbox.checked) {
      updatePermissions = updatePermissions.filter(permission => permission !== checkbox.value);
    }

    this.setState({
      permissions: updatePermissions
    });
  }

  render() {
    const { user } = this.props;

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permission: this.state.permissions,
          userId: this.props.user.id,
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colspan="8">
                  <Error error={error} />
                </td>
              </tr>
            )}

            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map((permission, index) => (
                <td key={`${user.id}-permission-${permission}`}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      disabled={loading}
                      type="checkbox"
                      id={`${user.id}-permission-${permission}`}
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    console.log("TCL: UserPermission -> this.props.user.id", this.props.user.id)
                    console.log("TCL: UserPermission -> this.state.permissions", this.state.permissions)
                    updatePermissions()
                  }}>
                  Updat{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

UserPermission.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    permission: PropTypes.array,
  }).isRequired,
};

export default Permission;
