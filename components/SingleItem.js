import React, { PureComponent } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Item from './Item';
import Error from './ErrorMessage';
import Head from 'next/head';
import styled from 'styled-components';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      price
      description
      largeImage
    }
  }
`;

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;


class SingleItem extends PureComponent {
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{
        id: this.props.id
      }}>
        {({error, loading, data}) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading</p>;
          if (!data.item) return <p>No item found for {this.props.id}</p>;

          const item = data.item;
          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          );
        }}
      </Query>
    )
  }
}

export default SingleItem;
