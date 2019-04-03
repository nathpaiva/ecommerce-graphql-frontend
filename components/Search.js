import React, { PureComponent } from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY(
    $searchTerm: String!
  ) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm },
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

class AutoComplete extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      loading: false,
    };

    this.onChange = debounce(this.onChange.bind(this), 350);
  }

  async onChange (evt, client) {
    this.setState({ loading: true });
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: evt.target.value }
    });

    console.log("TCL: AutoComplete -> onChange -> res", res)

    this.setState({
      items: res.data.items,
      loading: false,
    });
  }

  render() {
    return (
      <SearchStyles>
        <div>
          <ApolloConsumer>
            {(client) => (
              <input
                type="search"
                onChange={evt => {
                  evt.persist();
                  this.onChange(evt, client);
                }}
              />
            )}
          </ApolloConsumer>
          <DropDown>
            {this.state.items.map(item => (
              <DropDownItem>
                <img width="50" src={item.image} alt={item.title} />
                {item.title}
              </DropDownItem>
            ))}
          </DropDown>
        </div>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
