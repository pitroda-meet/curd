import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import "./App.css";

import App from "./App.jsx";
import Home from "./Layouts/Home.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProduct from "./Layouts/AddProduct.jsx";
import EditProduct from "./layouts/EditProduct.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
// Set up your router here with `createBrowserRouter`
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/addproduct", element: <AddProduct /> },
      { path: "/editproduct/:id", element: <EditProduct /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        pauseOnFocusLoss={true}
      />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);