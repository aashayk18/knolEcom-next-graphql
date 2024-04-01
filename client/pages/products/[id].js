import Product from "../../components/Product/Product";
import client from "../../api/apolloClient";
import { FETCH_PRODUCT_IDS, FETCH_PRODUCT } from "../../api/queries";

export default function ProductPage({ product }) {
  return <Product product={product} />;
}

export async function getStaticPaths() {
  try {
    const { data } = await client.query({
      query: FETCH_PRODUCT_IDS,
    });
    const ids = data.productIds;
    const paths = ids.map((id) => ({
      params: { id: id.toString() },
    }));
    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error fetching product IDs:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  const { data } = await client.query({
    query: FETCH_PRODUCT,
    variables: {
      id: params.id
    }
  });
  const product = data.product;
  return { props: { product } };
}
