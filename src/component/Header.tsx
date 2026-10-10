import { Moon, ShoppingCart } from "lucide-react";
import NavBar from "./NavBar";

export default function Header() {

    return (
        <header className="w-full bg-primary-light">
          <div className="w-full max-w-7xl px-6 mx-auto flex h-15 items-center justify-between">
            <div className="w-11 rounded-2xl bg-blue-500 p-2 text-center text-2xl font-bold text-amber-50">
                <p>V</p>
            </div>

            <div className="bg-primary-light">
                <NavBar />
            </div>

            <div className="flex gap-6">
                <Moon />
                
                <ShoppingCart />
            </div>


          </div>
        </header>
    )

}