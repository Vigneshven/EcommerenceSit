import { NavLink } from "react-router-dom"

function NavBar() {


  return (
    <div>
        <nav className="flex flex-1 gap-4 bg-primary-light">
            <NavLink className={({isActive})=>`rounded-lg p-1 ${isActive?"bg-primary-dark text-primary-light":"bg-primary-light text-text-dark"}`} to={"/"}>Home</NavLink>
            <NavLink className={({isActive})=>`rounded-lg p-1 ${isActive?"bg-primary-dark text-primary-light":"bg-primary-light text-text-dark"}`}  to={"/about"}>About</NavLink> 
            <NavLink className={({isActive})=>`rounded-lg p-1 ${isActive?"bg-primary-dark text-primary-light":"bg-primary-light text-text-dark"}`}  to={"/product"}>Product</NavLink>
            <NavLink className={({isActive})=>`rounded-lg p-1 ${isActive?"bg-primary-dark text-primary-light":"bg-primary-light text-text-dark"}`}  to={"/cart"}>Cart</NavLink>
        </nav>

        
    </div>
  )
}

export default NavBar