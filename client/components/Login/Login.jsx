import React, { useState } from "react";
import { LOGIN_USER } from "../../api/mutations";
import {useMutation} from  "@apollo/client";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "./Login.module.css";

export default function Login() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme();

  const [loginUser] = useMutation(LOGIN_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const {data} = await loginUser({
        variables: {
          name,
          phoneNumber,
          password,
        },
      });

      localStorage.setItem("userName", name);
      localStorage.setItem("phoneNumber", phoneNumber);

      const token = data.token;
      localStorage.setItem("token", token);

      const expirationTime = data.expirationTime;
      const expiryTime = new Date().getTime() + expirationTime * 1000;
      localStorage.setItem("expirationTime", expiryTime);

      if (window.confirm("Logged in successfully!")) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div
      className={`${styles.container} d-flex justify-content-center align-items-center`}
      style={{
        backgroundColor: theme === "light" ? "white" : "#131313",
        color: theme === "light" ? "black" : "white",
      }}
    >
      <div
        className="card p-5"
        style={{
          backgroundColor: theme === "light" ? "white" : "#131313",
          color: theme === "light" ? "black" : "white",
          borderColor: "#808080",
        }}
      >
        <h2 className="mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
