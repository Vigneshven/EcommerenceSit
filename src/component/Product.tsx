import Account from "./Account"
import Header from "./Header"
import ProductFilterForm from "./ProductFilterForm"

function Product() {
    return (
        <div>
            <div>
                <Account />
                <Header />
            </div>
            <div>
                <ProductFilterForm/>
            </div>

        </div>
    )
}

export default Product