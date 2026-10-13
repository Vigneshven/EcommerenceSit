import { Route, Routes } from "react-router-dom"
import Home from "../component/Home"
import About from "../component/About"
import Product from "../component/Product"
import Cart from "../component/Cart"
import ProductDetails from "../component/ProductDetails"
import Login from "../component/Login"
import Register from "../component/Register"

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>


    </div>
  )
}

export default AppRoutes