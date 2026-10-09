import { Moon, ShoppingBag, Store } from "lucide-react";
import NavBar from "./NavBar";

export default function Header(){

    return(
        <div className=" bg-blue-100 flex flex-1 justify-evenly items-center h-15">
        <div>
            <Store/>
        </div>

        <div>
            <NavBar/>
        </div>

        <div>
            <Moon/>
        </div>

        <div>
            <ShoppingBag/>
        </div>
        
        
        </div>
    )

}