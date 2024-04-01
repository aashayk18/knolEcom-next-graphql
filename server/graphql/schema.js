const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String!
    image: String!
    avgRating: Float!
    category: String!
  }

  type User {
    id: ID!
    name: String!
    phoneNumber: String!
    cart: [String]!
    orders: [String]!
  }

  type AuthPayload {
    token: String!
    expirationTime: String!
  }

  type Query {
    fetchProducts(search: String, category: String, rating: String, sortBy: String): [Product]! #works
    product(id: ID!): Product #works
    productIds: [ID]! #works
    userCartItems(phoneNumber: String!): [String]! #works, but needs authentication (used phoneNumber)
    userOrders(phoneNumber: String!): [String]! #works, but needs authentication (used phoneNumber)
  }

  type Mutation {
    loginUser(name: String!, phoneNumber: String!, password: String!): AuthPayload! #works
    addToCart(productId: ID!, phoneNumber: String!): String! #works, but needs authentication (used phoneNumber)
    deleteFromCart(productId: ID!, phoneNumber: String!): String! #works, but needs authentication (used phoneNumber)
    placeOrder(phoneNumber: String!): String! #works, but needs authentication (used phoneNumber)
  }
`;

module.exports = typeDefs;
