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
  }

  render() {
    return (
      <Form>
        <fieldset>
          <label htmlFor="title">
            Title
            <input type="text" id="title" name="title" placeholder="Title" required value={this.state.title} />
          </label>
          <label htmlFor="description">
            Description
            <input type="text" id="description" name="description" placeholder="Description" required value={this.state.description} />
          </label>
        </fieldset>
        <h1>Sell an Item.</h1>
      </Form>
    )
  }
}
