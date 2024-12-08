import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  FetchProducts,
} from "../features/ProductFeatures/productSlice";
import AlertMessage from "../components/AlertMessage";
import Loader from "../components/Loader";
import { Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(FetchProducts());
  }, [dispatch]);

  const productList = useSelector((state) => state.products);
  const { products, loading, error } = productList;

  if (loading) return <Loader />;
  if (error) return <AlertMessage message={`Error: ${error}`} />;

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <Container>
      <h1 className="my-4">Product List</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product._id || index}>
                <td>{index + 1}</td>
                <td>{product.name || "N/A"}</td>
                <td>{product.description || "N/A"}</td>
                <td>${product.price?.toFixed(2) || "N/A"}</td>
                <td>{product.category || "N/A"}</td>
                <td>
                  {product.Image_Url ? (
                    <img
                      src={product.Image_Url}
                      alt={product.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {" "}
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDelete(product._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/editproduct/${product._id}`)}
                    style={{ marginLeft: "10px" }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No Products Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Home;
