import { Grid2X2, Menu } from "lucide-react"
import { products } from "../data/productsdata"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { useQuery } from "@tanstack/react-query"

function ShowProduct() {

    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1)


    const [view, setView] = useState<"grid" | "list">("grid")

    const productsPerPage = 9;

    const handleProductClick = (id: number): void => {
        navigate(`/product/${id}`)
    }

    const handlePageChange = (page: number): void => {
        setCurrentPage(page)
    }

    const filters = useSelector((state: RootState) => state.filters)

    const {
        data: filterProducts = [],
    } = useQuery({
        queryKey: ["products", filters],

        queryFn: () => {
            let result = [...products]

            if (filters.search.trim()) {
                result = result.filter((product) =>
                    product.name.toLowerCase().includes(filters.search.trim().toLowerCase())
                )
            }

            if (filters.category !== 'all') {
                result = result.filter((product) => product.category === filters.category)

            }

            if (filters.company !== 'all') {
                result = result.filter((product) => product.company == filters.company)
            }

            result = result.filter((product) => {
                const price =
                    typeof product.price === "number"
                        ? product.price
                        : Number(String(product.price).replace(/[^0-9.]/, ""));

                return price <= filters.selling_price;
            });
            if (filters.free_shipping) {
                result = result.filter(
                    (product) => product.free_shipping === true
                );
            }
            switch (filters.sortBy) {
                case "a-z":
                    result.sort((a, b) => a.name.localeCompare(b.name));
                    break;

                case "z-a":
                    result.sort((a, b) => b.name.localeCompare(a.name));
                    break;

                case "low-high":
                    result.sort(
                        (a, b) =>
                            Number(String(a.price).replace(/[^0-9.]/, "")) -
                            Number(String(b.price).replace(/[^0-9.]/, ""))
                    );
                    break;

                case "high-low":
                    result.sort(
                        (a, b) =>
                            Number(String(b.price).replace(/[^0-9.]/, "")) -
                            Number(String(a.price).replace(/[^0-9.]/, ""))
                    );
                    break;
            }

            return result;
        },
    });
    if (filterProducts.length === 0) {
        return <p className="mt-8 text-center">No products found.</p>;
    }

    const totalPages = Math.ceil(filterProducts.length / productsPerPage)

    const startIndex = (currentPage - 1) * productsPerPage

    const endIndex = startIndex + productsPerPage

    const currentProducts = filterProducts.slice(startIndex, endIndex)

    return (
        <>
            <div className="mt-8 flex w-full items-center justify-between">

                <div>
                    <h4>{filterProducts.length} Product</h4>
                </div>

                <div className="flex gap-4">
                    <button type="button" onClick={() => setView("grid")}
                        className={view === "grid" ? "bg-primary rounded-1xl" : "text-primary-dark"}><Grid2X2 /></button>
                    <button type="button" onClick={() => setView("list")}
                        className={view === "list" ? "bg-primary rounded-1xl" : "text-primary-dark"}><Menu /></button>
                </div>
            </div>

            <div className="flex flex-1 justify-center items-center mt-4">
                <hr className="w-full border-primary-light border-t-2" />
            </div>

            <div className={view === "grid" ? "grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" :
                "flex flex-col gap-5"
            }>

                {currentProducts.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className={`cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow transition hover:shadow-lg hover:bg-primary-light
                            ${view === "grid" ? "" : "flex items-center gap-3 p-4"}
                            
                            `}
                    >
                        <img
                            className={view === "grid" ? "h-56 w-full object-cover"
                                : "h-28 w-28 shrink-0 rounded-lg object-cover"}
                            src={product.image}
                            alt={product.name}
                        />

                        <div
                            className={
                                view === "grid"
                                    ? "flex flex-col items-center justify-center p-4"
                                    : "flex min-w-0 flex-1 items-center justify-between gap-4"
                            }
                        >
                            <div className={view === "grid" ? "" : "min-w-0"}>
                                <h2 className="text-lg font-semibold text-text-light">
                                    {product.name}
                                </h2>

                                {view === "list" && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        {product.company}
                                    </p>
                                )}
                            </div>

                            <span className="mt-2 block shrink-0 font-medium text-primary">
                                {product.price}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex w-full flex-wrap justify-end gap-3">

                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-lg bg-primary-light px-4 py-2 text-primary-dark hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        PREV
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`rounded-lg px-4 py-2 ${currentPage === page
                                ? "bg-primary text-white"
                                : "bg-primary-light text-primary-dark hover:bg-primary hover:text-white"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="rounded-lg bg-primary-light px-4 py-2 text-primary-dark hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        NEXT
                    </button>

                </div>
            )}

        </>
    )
}

export default ShowProduct
