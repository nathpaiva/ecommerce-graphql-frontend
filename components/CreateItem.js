import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

export default class CreateItem extends Component {
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
  }

  handlerChange(e) {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: val
    });
  }

  render() {
    return (
      <Form onSubmit={(e) => {
        e.preventDefault();
        console.log(this.state);
      }} >
        <fieldset>
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
    )
  }
}
