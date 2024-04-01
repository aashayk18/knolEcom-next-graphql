import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation loginUser($name: String!, $phoneNumber: String!, $password: String!) {
    loginUser(name: $name, phoneNumber: $phoneNumber, password: $password) {
      token,
      expirationTime
    }
}
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $phoneNumber: String!) {
    addToCart(productId: $productId, phoneNumber: $phoneNumber)
  }
`;

export const DELETE_FROM_CART = gql`
  mutation DeleteFromCart($productId: ID!, $phoneNumber: String!) {
    deleteFromCart(productId: $productId, phoneNumber: $phoneNumber)
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($phoneNumber: String!) {
    placeOrder(phoneNumber: $phoneNumber) 
  }
`;
