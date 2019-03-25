import React, { PureComponent } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';



const DETELE_ITEM_MUTATION = gql`
  mutation DETELE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends PureComponent {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  update(cache, paylod) {
		console.log("TCL: DeleteItem -> update -> paylod", paylod)
    const data = cache.readQuery({
      query: ALL_ITEMS_QUERY
    });
    console.log("TCL: DeleteItem -> update -> data", data)
    data.items = data.items.filter(item => item.id !== paylod.data.deleteItem.id);
		console.log("TCL: DeleteItem -> update -> data", data)
    console.log("TCL: DeleteItem -> update -> ALL_ITEMS_QUERY", ALL_ITEMS_QUERY)
    cache.writeQuery({
      query: ALL_ITEMS_QUERY,
      data
    })
  }

  render() {
    const { children, id } = this.props;
    return (
      <Mutation
        mutation={DETELE_ITEM_MUTATION}
        variables={{
          id
        }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button onClick={() => {
            if(confirm('Are you sure you want to delete this item?')) {
              deleteItem();
            }
          }}>
            {children}
          </button>
        )}
      </Mutation>
    )
  }
}

export default DeleteItem;
