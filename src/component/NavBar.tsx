import { Link } from "react-router-dom"

function NavBar() {


  return (
    <div>
        <nav className="flex flex-1 gap-6">
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About</Link> 
            <Link to={"/product"}>Product</Link>
            <Link to={"/cart"}>Cart</Link>
        </nav>

        
    </div>
  )
}

export default NavBar