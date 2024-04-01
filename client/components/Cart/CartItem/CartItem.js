import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_FROM_CART } from "../../../api/mutations";
import { useTheme } from "../../../contexts/ThemeContext";

export default function CartItem(props) {
  const { theme } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [deleteCart] = useMutation(DELETE_FROM_CART);

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }
  }, []);  

  const deleteFromCart = async () => {
    try {
      const id = props.id;
      console.log(id);
      console.log(phoneNumber);
      const { data } = await deleteCart({
        variables: {
          productId: id,
          phoneNumber: phoneNumber,
        },
      });
      props.setCartProducts(props.cartProducts.filter(product=> product.id !== props.id));
      console.log("Product removed from cart:", data);
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  return (
    <div
      className="card mb-3"
      style={{
        backgroundColor: theme === "dark" ? "#101010" : "white",
        color: theme === "dark" ? "white" : "#101010",
        borderColor: theme === "dark" ? "white" : "",
      }}
    >
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={props.image}
            className="img-fluid rounded-start"
            alt={props.name}
            style={{ width: "200px", height: "150px" }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-name">{props.name}</h5>
            <p className="card-text">Price: ${props.price}</p>
            <button onClick={deleteFromCart} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
