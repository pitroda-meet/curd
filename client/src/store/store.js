import { configureStore } from "@reduxjs/toolkit";
import productSlice from "../features/ProductFeatures/productSlice";
const store = configureStore({
  reducer: {
    products: productSlice,
  },
});

export default store;
