import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION (
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      image: '',
      largeImage: '',
      price: 0
    };

    this.handlerChange = this.handlerChange.bind(this);
    this.upploadFile = this.upploadFile.bind(this);
  }

  handlerChange(e) {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: val
    });
  }

  async upploadFile(e) {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfists');

    const res = await fetch('https://api.cloudinary.com/v1_1/dlhnknbip/image/upload', {
      method: 'POST',
      body: data,
    });

    if(!res.ok) return;

    const file = await res.json();

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error}) => (
          <Form onSubmit={async e => {
            e.preventDefault();
            const res = await createItem();

            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id }
            })
          }} >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                File
                <input type="file" id="file" name="file" placeholder="file" required onChange={this.upploadFile} />
              </label>
              {this.state.image && <img src={this.state.image} alt="Updaload preview" width="200px" />}
              <label htmlFor="title">
                Title
                <input type="text" id="title" name="title" placeholder="Title" required value={this.state.title} onChange={this.handlerChange} />
              </label>
              <label htmlFor="price">
                Price
                <input type="number" id="price" name="price" placeholder="Price" required value={this.state.price} onChange={this.handlerChange} />
              </label>
              <label htmlFor="description">
                Description
                <textarea id="description" name="description" placeholder="Enter a description" required value={this.state.description} onChange={this.handlerChange} />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
            <h1>Sell an Item.</h1>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
