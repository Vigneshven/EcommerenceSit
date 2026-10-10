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
            <div className="flex flex-1 justify-center items-center gap-3 mt-10">
                <ProductFilterForm/>
            </div>

            <div>
                <ShowProduct/>
            </div>

        </div>
    )
}

export default Product