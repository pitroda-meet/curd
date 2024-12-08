import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  product: {},
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getProductRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getProductSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;
    },
    getProductFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },
    createProductStart(state) {
      state.loading = true;
      state.error = null;
    },
    createProductSuccess(state, action) {
      state.loading = false;
      state.products.push(action.payload.product);
      toast.success(action.payload.message);
    },
    createProductFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },
    deleteProductStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess(state, action) {
      state.loading = false;
      state.products = state.products.filter(
        (p) => p._id !== action.payload.id
      );
      toast.success(action.payload.message);
    },
    deleteProductFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },
    getSingleProductStart(state) {
      state.loading = true;
      state.error = null;
    },
    getSingleProductSuccess(state, action) {
      state.loading = false;
      state.product = action.payload;
    },
    getSingleProductFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },

    updateProductStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateProductSuccess(state, action) {
      state.loading = false;
      const updatedProduct = action.payload.product;

      state.products = state.products.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      );

      toast.success(action.payload.message || "Product updated successfully!");
    },
    updateProductFailure(state, action) {
      state.loading = false;
      state.error = action.payload;

      toast.error(action.payload || "Failed to update product");
    },
    getSingleProductStart(state) {
      state.loading = true;
      state.error = null;
    },
    getSingleProductSuccess(state, action) {
      state.loading = false;
      state.product = action.payload; // Populate the product state
    },
    getSingleProductFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getProductRequest,
  getProductSuccess,
  getProductFailure,
  createProductStart,
  createProductSuccess,
  createProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  getSingleProductStart,
  getSingleProductSuccess,
  getSingleProductFailure,
} = productSlice.actions;

export default productSlice.reducer;

export const FetchProducts = () => async (dispatch) => {
  dispatch(getProductRequest());
  try {
    const response = await fetch(`http://localhost:3000/api/getproducts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    dispatch(getProductSuccess(data));
  } catch (error) {
    dispatch(getProductFailure(error.message));
  }
};

export const createProduct = (formData, navigate) => async (dispatch) => {
  dispatch(createProductStart());
  try {
    const response = await fetch("http://localhost:3000/api/uploadproduct", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    dispatch(createProductSuccess(data));
    navigate("/");
  } catch (error) {
    dispatch(createProductFailure(error.message));
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  dispatch(deleteProductStart());
  try {
    const response = await fetch(
      `http://localhost:3000/api/deleteproduct/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete the product");
    }

    const data = await response.json();
    dispatch(deleteProductSuccess({ id, message: data.message }));
  } catch (error) {
    dispatch(deleteProductFailure(error.message));
  }
};
export const getProductById = (id) => async (dispatch) => {
  dispatch(getSingleProductStart());
  try {
    const response = await fetch(
      `http://localhost:3000/api/getbyproducts/${id}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch product");
    }

    dispatch(getSingleProductSuccess(data.product)); // Correctly set single product
  } catch (error) {
    dispatch(getSingleProductFailure(error.message));
  }
};

export const updateProduct =
  ({ id, updatedFormData, navigate }) =>
  async (dispatch) => {
    dispatch(updateProductStart());
    try {
      const response = await fetch(
        `http://localhost:3000/api/updateProduct/${id}`,
        {
          method: "PUT",
          body: updatedFormData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      dispatch(updateProductSuccess(data));

      if (navigate) navigate("/");
    } catch (error) {
      dispatch(updateProductFailure(error.message));
    }
  };
