import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Alert from "../Alert/Alert";
import { useMutation } from '@apollo/client';
import { ADD_TO_CART } from '../../api/mutations';
import { useTheme } from "../../contexts/ThemeContext";

export default function ProductPage({ product }) {
  const [alert, setAlert] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { theme } = useTheme();

  const [addToCart] = useMutation(ADD_TO_CART);

  useEffect(() => {

    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("expirationTime");
    const phoneNumber = localStorage.getItem("phoneNumber");
    setPhoneNumber(phoneNumber);

    if (token && expirationTime) {
      if (expirationTime < Date.now()) {
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
    } else {
      setAuthenticated(false);
    }

  }, []);


  const handleAddToCart = async () => {
    if (!authenticated) {
      showAlert("Login to add an item to your cart!");
    } else {
      try {
        const {data} = await addToCart(
          {
            variables: {
              productId: id,
              phoneNumber             
            }
          }
        );
        console.log("Product added to cart:", data);
        showAlert("Successfully added to your shopping cart!");
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    }
  };

  const showAlert = (message) => {
    setAlert({ msg: message });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: theme === "light" ? "white" : "#131313",
        height: "100vh",
        color: theme === "light" ? "black" : "white",
      }}
    >
      <div className="container">
        <div className="row gx-5">
          <aside className="col-lg-6">
            <div className="border rounded-4 mb-3 d-flex justify-content-center">
              <img
                style={{ maxWidth: "100%", maxHeight: "100vh", margin: "auto" }}
                className="rounded-4 fit"
                src={product.image}
                alt={product.name}
              />
            </div>
          </aside>
          <main className="col-lg-6">
            <div className="ps-lg-3">
              <h4
                className={`title text-${theme === "dark" ? "light" : "dark"}`}
              >
                {product.name}
              </h4>
              <div className="d-flex flex-row my-3">
                <div className="text-warning mb-1 me-2">
                  <span className="ms-1">{product.avgRating}⭐</span>
                </div>
              </div>
              <div className="mb-3">
                <span className="h5">${product.price}</span>
              </div>
              <p>{product.description}</p>
              <hr />
              <button
                onClick={handleAddToCart}
                className="btn btn-primary shadow-0"
              >
                Add to Cart
              </button>
            </div>
          </main>
        </div>
      </div>
      <Alert alert={alert} />
    </section>
  );
}
