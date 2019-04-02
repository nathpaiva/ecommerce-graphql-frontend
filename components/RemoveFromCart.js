import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION (
    $id: ID!
  ) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  background-color: none;
  border: none;
  font-size: 3rem;

  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends PureComponent {
  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{id: this.props.id}}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(removeFromCart, { loading }) => (
          <BigButton disabled={loading} title="Delete Item" onClick={() => removeFromCart().catch(err => alert(err.message))}>
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
};

export default RemoveFromCart;
