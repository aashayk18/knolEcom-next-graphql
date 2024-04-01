import React, { useState, useEffect } from "react";
import ProductCard from "../components/Product/ProductCard/ProductCard";
import { useRouter } from "next/router";
import { useTheme } from "../contexts/ThemeContext";
import { useQuery } from "@apollo/client";
import { FETCH_PRODUCTS } from "../api/queries";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { theme } = useTheme();
  const router = useRouter();

  const { loading, error, data } = useQuery(FETCH_PRODUCTS, {
    variables: {
      search: router.query.search,
      category: router.query.category,
      rating: router.query.rating,
      sortBy: router.query.sortBy
    },
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setProducts(data.fetchProducts);
    }
  }, [loading, error, data]);

  return (
    <div
      className={`${styles.outer}`}
      style={{ backgroundColor: theme === "light" ? "white" : "#131313 " }}
    >
      <div className="container text-center mt-5">
        <h1
          className={`mb-3 ${styles.title}`}
          style={{ color: theme === "light" ? "black" : "white" }}
        >
          Products
        </h1>
        <div className="row">
          {products.map((product) => (
            <div className="col-md-3 mb-4" key={product.id}>
              <ProductCard
                name={product.name}
                id={product.id}
                price={product.price}
                desc={product.description}
                rating={product.avgRating}
                img={product.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
