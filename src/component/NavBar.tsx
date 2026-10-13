import { NavLink } from "react-router-dom"

function NavBar() {


  return (
    <div>
        <nav className="flex flex-1 gap-4">
            <NavLink className={({isActive})=>`rounded-lg p-1 ${isActive?"bg-primary-dark text-header-text":"text-header-text hover:bg-hover-background"}`} to={"/"}>Home</NavLink>
            <NavLink className={({isActive})=>`rounded-lg p-1 ${isActive?"bg-primary-dark text-header-text":"text-header-text hover:bg-hover-background"}`}  to={"/about"}>About</NavLink>
            <NavLink className={({isActive})=>`rounded-lg p-1 ${isActive?"bg-primary-dark text-header-text":"text-header-text hover:bg-hover-background"}`}  to={"/product"}>Product</NavLink>
            <NavLink className={({isActive})=>`rounded-lg p-1 ${isActive?"bg-primary-dark text-header-text":"text-header-text hover:bg-hover-background"}`}  to={"/cart"}>Cart</NavLink>
        </nav>

        
    </div>
  )
}

export default NavBar
