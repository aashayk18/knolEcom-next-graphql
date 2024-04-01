const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const User = require("../models/User");

const resolvers = {
  Query: {
    fetchProducts: async (_, { search, category, rating, sortBy }) => {
      let query = {};

      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        };
      }

      if (category) {
        query.category = { $regex: new RegExp(category, "i") };
      }

      if (rating) {
        const ratingValue = parseFloat(rating.split(" ")[1]);
        let comparisonOperator;

        if (rating.startsWith("Above")) {
          comparisonOperator = "$gte";
        }

        query.avgRating = { [comparisonOperator]: ratingValue };
      }

      let products = await Product.find(query);

      if (sortBy) {
        if (sortBy === "priceLTH") {
          products = products.sort((a, b) => a.price - b.price);
        } else if (sortBy === "priceHTL") {
          products = products.sort((a, b) => b.price - a.price);
        } else if (sortBy === "ratingDesc") {
          products = products.sort((a, b) => b.avgRating - a.avgRating);
        }
      }

      return products;
    },
    product: async (_, { id }) => {
      return await Product.findById(id);
    },
    productIds: async () => {
      const products = await Product.find({}, "_id");
      return products.map((product) => product._id.toString());
    },
    userCartItems: async (_, { phoneNumber }) => {
      let user = await User.findOne({ phoneNumber });
      return user.cart;
    },
    userOrders: async (_, { phoneNumber }) => {
      let user = await User.findOne({ phoneNumber });
      return user.orders;
    },
  },
  Mutation: {
    loginUser: async (_, { name, phoneNumber, password }) => {
      let user = await User.findOne({ phoneNumber });
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
          name,
          phoneNumber,
          password: hashedPassword,
        });
        await user.save();
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid password.");
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const expirationTime = new Date().getTime() + 60 * 60 * 1000;
      return { token, expirationTime };
    },
    addToCart: async (_, { productId, phoneNumber }) => {
      const user = await User.findOne({ phoneNumber });

      if (!user.cart.includes(productId)) {
        user.cart.push(productId);
      }

      await user.save();
      return "Added successfully!";
    },
    deleteFromCart: async (_, { productId, phoneNumber }) => {
      const user = await User.findOne({ phoneNumber });
      const index = user.cart.indexOf(productId);
      console.log(phoneNumber)

      if (index > -1) {
        user.cart.splice(index, 1);
      }

      await user.save();
      return "Deleted successfully!";
    },
    placeOrder: async (_, { phoneNumber }) => {
      const user = await User.findOne({ phoneNumber });
      user.orders.push(...user.cart);
      user.cart = [];
      await user.save();
      return "Order placed successfully!";
    },
  },
};

module.exports = resolvers;
