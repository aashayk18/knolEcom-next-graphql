// queries (tbd)

const fetchCartItems = async () => {
  try {
    const response = await axios.get(`${baseUrl}/db/cart`, {
      headers: {
        Authorization: token,
      },
    });
    setCartItems(response.data);
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

const fetchCartProducts = async (productId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

const fetchAllCartProducts = async () => {
  try {
    const productPromises = cartItems.map(fetchCartProducts);
    const products = await Promise.all(productPromises);
    setCartProducts(products);
  } catch (error) {
    console.error("Error fetching cart products:", error);
  }
};

async function fetchProducts() {
  try {
    const { search, category, rating, sortBy } = router.query;

    let url = `${baseUrl}/api/products`;

    let isFirstParam = true;

    if (search) {
      url += `${isFirstParam ? "?" : "&"}search=${search}`;
      isFirstParam = false;
    }

    if (category) {
      url += `${isFirstParam ? "?" : "&"}category=${category}`;
      isFirstParam = false;
    }

    if (rating) {
      url += `${isFirstParam ? "?" : "&"}rating=${rating}`;
      isFirstParam = false;
    }

    if (sortBy) {
      url += `${isFirstParam ? "?" : "&"}sortBy=${sortBy}`;
      isFirstParam = false;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (response.data.message === "Invalid token.") {
      router.push("/login");
    } else {
      setProducts(response.data);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

export async function getStaticPaths() {
  const baseUrl = "https://knol-ecom-next.vercel.app";
  const response = await axios.get(`${baseUrl}/api/product/ids`);
  const ids = response.data;
  const paths = ids.map((id) => ({
    params: { id: id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const baseUrl = "https://knol-ecom-next.vercel.app";
  const response = await axios.get(`${baseUrl}/api/products/${params.id}`);
  const product = response.data;

  return { props: { product } };
}

// mutations (done adding to mutations file, to be added in the respective files in place of the api calls)

const deleteFromCart = async () => {
  try {
    const id = props.id;
    console.log(id);
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${baseUrl}/db/cart/delete`,
      { productId: id },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("Product removed from cart:", response.data);
  } catch (error) {
    console.error("Error removing product from cart:", error);
  }
};

const placeOrder = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(`${baseUrl}/orders/place`, cartItems, {
      headers: {
        Authorization: token,
      },
    });

    setCartItems([]);
  } catch (error) {
    console.error("Error placing order:", error);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post(`${baseUrl}/login`, {
      name,
      phoneNumber,
      password,
    });
    localStorage.setItem("userName", name);
    const responseData = response.data.responsePayload;
    const token = responseData.token;
    const expirationTime = responseData.expirationTime;
    localStorage.setItem("token", token);
    const expiryTime = new Date().getTime() + expirationTime * 1000;
    localStorage.setItem("expirationTime", expiryTime);
    if (window.confirm("Logged in successfully!")) {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

const handleAddToCart = async () => {
  const token = localStorage.getItem("token");
  const expirationTime = localStorage.getItem("expirationTime");
  if (token && expirationTime) {
    if (expirationTime < Date.now()) {
      setAuthenticated(false);
    } else {
      setAuthenticated(true);
    }
  } else {
    setAuthenticated(false);
  }
  if (!authenticated) {
    showAlert("Login to add an item to your cart!");
  } else {
    try {
      const response = await axios.post(
        `${baseUrl}/db/cart/add`,
        { productId: id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Product added to cart:", response.data);
      showAlert("Successfully added to your shopping cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }
};
