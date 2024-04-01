import React, { useState, useEffect } from "react";
import OrderItem from "./OrderItem/OrderItem";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import client from "../../api/apolloClient";
import { FETCH_PRODUCT, FETCH_USER_ORDERS } from "../../api/queries";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "./Orders.module.css";

export default function Orders() {
  const [orderItems, setOrderItems] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const { theme } = useTheme();

  const { data: orderItemsData, loading: orderItemsLoading } = useQuery(
    FETCH_USER_ORDERS,
    {
      variables: {
        phoneNumber,
      },
    }
  );

  useEffect(() => {
    if (!orderItemsLoading && orderItemsData) {
      setOrderItems(orderItemsData.userOrders);
    }
  }, [orderItemsData, orderItemsLoading]);

  useEffect(() => {

    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("expirationTime");
    const phoneNumber = localStorage.getItem("phoneNumber");
    setPhoneNumber(phoneNumber);

    const fetchOrderProducts = async () => {
      try {
        if (orderItems.length > 0) {
          const productPromises = orderItems.map((productId) =>
            fetchProduct(productId)
          );
          const productsData = await Promise.all(productPromises);
          const products = productsData.map((data) => data.product); 
          console.log(products)
          setOrderProducts(products);
        }
      } catch (error) {
        console.error("Error fetching order products:", error);
      }
    };

    fetchOrderProducts();

    if (token && expirationTime) {
      if (expirationTime < Date.now()) {
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
    } else {
      setAuthenticated(false);
    }
  }, [orderItems]);

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
        <h5>Login to see your orders!</h5>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container}`}
      style={{
        backgroundColor: theme === "light" ? "white" : "#131313 ",
        color: theme === "light" ? "black" : "white",
      }}
    >
      <br />
      <h1 className="mb-4">Orders</h1>
      <div className="row">
        <div className="col-md-8">
          {orderProducts.length > 0 ? (
            orderProducts.map((item, index) => (
              <OrderItem
                key={index}
                name={item.name}
                price={item.price}
                image={item.image}
                id={item.id}
              />
            ))
          ) : (
            <>
              <h5>You have no previous orders!</h5>
              <br />
              <h6>
                Once you complete any purchases, they will be displayed here.
              </h6>
            </>
          )}
        </div>
        <div className="col-md-4">
          <Link href="/" className="btn btn-secondary me-2">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
