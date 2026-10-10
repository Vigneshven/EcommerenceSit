import Account from "./Account"
import Header from "./Header"
import ProductFilterForm from "./ProductFilterForm"
import ShowProduct from "./ShowProduct"

function Product() {
    return (
        <div>
            <div>
                <Account />
                <Header />
            </div>
            <div className="w-full max-w-7xl px-6 mx-auto mt-10 flex items-center justify-center gap-3">
                <ProductFilterForm/>
            </div>

            <div className="w-full max-w-7xl px-6 mx-auto">
                <ShowProduct/>
            </div>

        </div>
    )
}

export default Product