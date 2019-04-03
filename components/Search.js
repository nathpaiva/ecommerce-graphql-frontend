import React, { PureComponent, Fragment } from 'react';
import Downshift, { resetIdCounter } from 'downshift';
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
    this.routeToItem = this.routeToItem.bind(this)
  }

  async onChange (evt, client) {
    this.setState({ loading: true });
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: evt.target.value }
    });

    this.setState({
      items: res.data.items,
      loading: false,
    });
  }

  routeToItem(item) {
    Router.push({
      pathname: '/item',
      query: {
        id: item.id
      },
    })
  }

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift onChange={this.routeToItem} itemToString={item => (item === null ? '' : item.title)}>
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
            <div>
              <ApolloConsumer>
                {(client) => (
                  <input
                    type="search"
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for item',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: evt => {
                        evt.persist();
                        this.onChange(evt, client);
                      }
                    })}
                  />
                )}
              </ApolloConsumer>

              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, index) => (
                    <DropDownItem
                      key={item.id}
                      {...getItemProps({ item })}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!this.state.items.length && !this.state.loading && (
                    <DropDownItem>Nothing found for {inputValue}</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
