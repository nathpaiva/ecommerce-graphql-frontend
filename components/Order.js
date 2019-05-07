import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Heade from 'next/head';
import gql from 'graphql-tag';

import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderItemStyles';

const SINEGLE_ORDER_QUERY = gql`
  query SINEGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

class Order extends PureComponent {
  render() {
    const { id } = this.props;

    return (
      <Query query={SINEGLE_ORDER_QUERY} variables={{ id }}>
        {({data, error, loading}) => {
          if (error) return <Error error={error} />
          if (loading) return <p>Loading...</p>

          return (
            <div>
              <p>Order ID: {id}</p>
            </div>
          )
        }}
      </Query>
    )
  }
}

Order.proptypes = {
  id: PropTypes.string.isRequired,
};

export default Order;
