import { gql } from "@apollo/client";

export const FETCH_CART_ITEMS = gql`
  query FetchCartItems {
    fetchCartItems {
      id
      name
      price
      description
      image
      avgRating
      category
    }
  }
`;

export const FETCH_PRODUCTS = gql`
  query FetchProducts(
    $search: String
    $category: String
    $rating: String
    $sortBy: String
  ) {
    fetchProducts(
      search: $search
      category: $category
      rating: $rating
      sortBy: $sortBy
    ) {
      id
      name
      price
      description
      image
      avgRating
      category
    }
  }
`;

export const FETCH_PRODUCT_IDS = gql`
  query ProductIds {
    productIds
  }
`;

export const FETCH_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      name
      price
      description
      image
      avgRating
      category
    }
  }
`;

export const FETCH_USER_CART = gql`
  query FetchUserCart($phoneNumber: String!) {
    userCartItems(phoneNumber: $phoneNumber)
  }
`;

export const FETCH_USER_ORDERS = gql`
  query FetchUserOrder($phoneNumber: String!) {
    userOrders(phoneNumber: $phoneNumber)
  }
`;
