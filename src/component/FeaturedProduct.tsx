import { useNavigate } from "react-router-dom"
import { products } from "../data/productsdata"

function FeaturedProduct() {

    const navigate = useNavigate()

    const handleProductClick = (id: number): void => {
        navigate(`/product/${id}`)
    }

    const featureproducts = products.slice(0, 8)

    return (
        <div className="flex w-full flex-col gap-5">

            <h2 className="mx-auto text-2xl font-sans self-start">Featured Products</h2>

            <hr className="w-full border-primary-light border-t-2" />

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {featureproducts.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow transition hover:shadow-lg hover:bg-primary-light"
                    >
                        <img
                            className="h-56 w-full object-cover"
                            src={product.image}
                            alt={product.name}
                        />

                        <div className="flex flex-col items-center justify-center p-4">
                            <h2 className="text-lg font-semibold text-text-light">
                                {product.name}
                            </h2>

                            <span className="mt-2 block font-medium text-primary">
                                {product.price}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FeaturedProduct
