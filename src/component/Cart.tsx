import Account from "./Account"
import Header from "./Header"

function Cart() {
    return (
        <div>

            <div>
                <Account />
                <Header />
            </div>

            <div className="ml-200 mt-15 flex flex-1 justify-start">

                <h2 className="text-3xl font-sans text-primary-dark">Your cart is empty</h2>
            </div>

            <div className="flex flex-1 justify-center items-center mt-4">
                <hr className="mx-auto w-6xl border-primary-light border-t-2"/>
            </div>



        </div>
    )
}

export default Cart