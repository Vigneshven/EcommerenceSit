import { Route, Routes } from "react-router-dom";
import Home from "../component/Home";
import About from "../component/About";
import Product from "../component/Product";
import Cart from "../component/Cart";
import ProductDetails from "../component/ProductDetails";
import Login from "../component/Login";
import Register from "../component/Register";
import Checkout from "../component/Checkout";
import Orders from "../component/Orders";
import ProductedRoutes from "./ProductedRoutes";
import PublicRoutes from "./PublicRoutes";

import NotFound from "../component/NotFound";

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProductedRoutes />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;
