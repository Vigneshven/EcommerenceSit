import Account from "./Account"
import Header from "./Header"

function Cart() {
    return (
        <div>

            <div>
                <Account />
                <Header />
            </div>

            <div className="w-full max-w-7xl px-6 mx-auto mt-15 flex justify-start">

                <h2 className="text-3xl font-sans text-primary-dark">Your cart is empty</h2>
            </div>

            <div className="w-full max-w-7xl px-6 mx-auto mt-4">
                <hr className="w-full border-primary-light border-t-2"/>
            </div>



        </div>
    )
}

export default Cart