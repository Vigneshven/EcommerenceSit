import { Grid2X2, Menu } from "lucide-react"

function ShowProduct() {
    return (
        <>
            <div className="mt-8 flex w-full items-center justify-between">

                <div>
                    <h4>21 Product</h4>
                </div>

                <div className="flex gap-4">
                    <button><Grid2X2 /></button>
                    <button><Menu /></button>
                </div>
            </div>

            <div className="flex flex-1 justify-center items-center mt-4">
                <hr className="w-full border-primary-light border-t-2"/>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                <div className="hover:shadow-primary-dark overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
                    <img
                        className="h-56 w-full object-cover"
                        src="https://images.pexels.com/photos/2959595/pexels-photo-2959595.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Furniture"
                    />
                    <div className="flex flex-1 flex-col justify-center items-center p-4">
                        <h2 className="text-lg font-semibold text-text-light">Convertible Sleeper Sofa</h2>
                        <span className="mt-2 block font-medium text-primary">$199.99</span>
                    </div>

                </div>
                <div className="hover:shadow-primary-dark overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"><img className="h-56 w-full object-cover" src="https://images.pexels.com/photos/5008397/pexels-photo-5008397.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                    <div className="flex flex-1 flex-col justify-center items-center p-4"><h2 className="text-lg font-semibold text-text-light">Kids Bunk Bed</h2><span className="mt-2 block font-medium text-primary">$119.99</span></div></div>

                <div className="hover:shadow-primary-dark overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"><img className="h-56 w-full object-cover" src="https://images.pexels.com/photos/7546217/pexels-photo-7546217.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                    <div className="flex flex-1 flex-col justify-center items-center p-4"><h2 className="text-lg font-semibold text-text-light">L-Shaped Sectional Couch</h2><span className="mt-2 block font-medium text-primary">$229.99</span></div></div>

                <div className="hover:shadow-primary-dark overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"><img className="h-56 w-full object-cover" src="https://images.pexels.com/photos/6044978/pexels-photo-6044978.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                    <div className="flex flex-1 flex-col justify-center items-center p-4"><h2 className="text-lg font-semibold text-text-light">Marble Side Table</h2>
                    <span className="mt-2 block font-medium text-primary">$59.99</span></div></div>

                <div className="hover:shadow-primary-dark overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"><img className="h-56 w-full object-cover" src="https://images.pexels.com/photos/2829032/pexels-photo-2829032.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                    <div className="flex flex-1 flex-col justify-center items-center p-4"><h2 className="text-lg font-semibold text-text-light">Oak Wood Coffee Table</h2>
                    <span className="mt-2 block font-medium text-primary">$26.78</span></div></div>

                <div className="hover:shadow-primary-dark overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"><img className="h-56 w-full object-cover" src="https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                    <div className="flex flex-1 flex-col justify-center items-center p-4"><h2 className="text-lg font-semibold text-text-light">Premium Leather Sectional</h2>
                    <span className="mt-2 block font-medium text-primary">$26.78</span></div></div>

                <div className="hover:shadow-primary-dark overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"><img className="h-56 w-full object-cover" src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                    <div className="flex flex-1 flex-col justify-center items-center p-4"><h2 className="text-lg font-semibold text-text-light">Reclining Sectional Sofa</h2>
                    <span className="mt-2 block font-medium text-primary">$26.78</span></div></div>

                <div className="hover:shadow-primary-dark overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"><img className="h-56 w-full object-cover" src="https://images.pexels.com/photos/785080/pexels-photo-785080.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                    <div className="flex flex-1 flex-col justify-center items-center p-4"><h2 className="text-lg font-semibold text-text-light">Wooden Top Dining Table</h2>
                    <span className="mt-2 block font-medium text-primary">$26.78</span></div></div>


            </div>

            <div className="mt-6 flex w-full justify-end gap-3">
                <div className="bg-primary-light text-primary-dark hover:text-primary-light"><button>PREV</button></div>
                <div className="bg-primary-light text-primary-dark hover:text-primary-light"><button>1</button></div>
                <div className="bg-primary-light text-primary-dark hover:text-primary-light"><button>2</button></div>
                <div className="bg-primary-light text-primary-dark hover:text-primary-light"><button>3</button></div>
                <div className="bg-primary-light text-primary-dark hover:text-primary-light"><button>NEXT</button></div>
            </div>

        </>
    )
}

export default ShowProduct