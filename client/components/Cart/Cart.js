import React, { useState, useEffect } from "react";
import CartItem from "./CartItem/CartItem";
import { useRouter } from "next/router";
import Link from "next/link";
import client from "../../api/apolloClient";
import { useQuery, useMutation } from "@apollo/client";
import { PLACE_ORDER } from "../../api/mutations";
import { FETCH_PRODUCT, FETCH_USER_CART } from "../../api/queries";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "./Cart.module.css";

export default function Cart() {
  const [authenticated, setAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const router = useRouter();
  const { theme } = useTheme();

  const [orderPlace] = useMutation(PLACE_ORDER);

  const {
    data: cartItemsData,
    loading: cartItemsLoading,
  } = useQuery(FETCH_USER_CART, 
    {variables: {
      phoneNumber
    }});

  useEffect(() => {
    if (!cartItemsLoading && cartItemsData) {
      setCartItems(cartItemsData.userCartItems);
    }
  }, [cartItemsData, cartItemsLoading]);

  useEffect(() => {

    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("expirationTime");
    const phoneNumber = localStorage.getItem("phoneNumber");
    setPhoneNumber(phoneNumber);

    const fetchCartProducts = async () => {
      try {
        if (cartItems.length > 0) {
          const productPromises = cartItems.map((productId) =>
            fetchProduct(productId)
          );
          const productsData = await Promise.all(productPromises);
          const products = productsData.map((data) => data.product); 
          console.log(products)
          setCartProducts(products);
        }
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };

    fetchCartProducts();

    if (token && expirationTime) {
      if (expirationTime < Date.now()) {
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
    } else {
      setAuthenticated(false);
    }

  }, [cartItems]);

  const fetchProduct = async (productId) => {
    try {
      const { data } = await client.query({
        query: FETCH_PRODUCT,
        variables: {
          id: productId,
        },
      });
      return data; 
    } catch (error) {
      console.error("Error fetching product:", error);
      return null; 
    }
  };

  const placeOrder = async () => {
    try {
      const phoneNumber = localStorage.getItem("phoneNumber");
      await orderPlace({
        variables: {
          phoneNumber,
        },
      });
      setCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (!authenticated) {
    return (
      <div
        className={`${styles.container}`}
        style={{
          backgroundColor: theme === "light" ? "white" : "#131313",
          color: theme === "light" ? "black" : "white",
        }}
      >
        <br />
        <h5>Login to see your cart!</h5>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container}`}
      style={{
        backgroundColor: theme === "light" ? "white" : "#131313",
        color: theme === "light" ? "black" : "white",
      }}
    >
      <br />
      <h1 className="mb-4">Cart 🛒</h1>
      <div className="row">
        <div className="col-md-8">
          {cartProducts.length > 0 ? (
            cartProducts.map((item, index) => (
              <CartItem
                key={index}
                name={item.name}
                price={item.price}
                image={item.image}
                id={item.id}
                cartProducts={cartProducts}
                setCartProducts={setCartProducts}
              />
            ))
          ) : (
            <>
              <br />
              <h5>Cart is empty!</h5>
              <h6>Add some items to the cart to see them here.</h6>
            </>
          )}
        </div>

        <div className="col-md-4">
          <div className="card mb-4" style={{ backgroundColor: "white" }}>
            <div className="card-body">
              <h5 className="card-title">Total:</h5>
              <p className="card-text">
                $ {cartProducts.reduce((total, item) => total + item.price, 0)}
              </p>
            </div>
          </div>

          <Link href="/" className="btn btn-secondary me-2">
            Back
          </Link>

          <button
            onClick={() => {
              placeOrder();
              alert("Your order has been placed!");
              router.push("/orders");
            }}
            className="btn btn-primary"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
