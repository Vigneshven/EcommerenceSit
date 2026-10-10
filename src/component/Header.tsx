import { Moon, ShoppingCart } from "lucide-react";
import NavBar from "./NavBar";

export default function Header() {

    return (
        <div className="w-full bg-primary-light flex flex-1 justify-evenly items-center h-15">
            <div className="p-2 rounded-2xl w-11 text-center font-bold text-2xl ml-80 text-amber-50 bg-blue-500">
                <p>V</p>
            </div>

            <div className="ml-80 bg-primary-light">
                <NavBar />
            </div>

            <div className="w-full flex flex-1 justify-end items-end mr-90 gap-6">
                <Moon />
                
                <ShoppingCart />
            </div>


        </div>
    )

}