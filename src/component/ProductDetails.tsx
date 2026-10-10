import { useParams } from "react-router-dom"
import { products } from "../data/productsdata"

type ProductDetails = {
    id: number
    image: string
    name: string
    company: string
    price: string
    description: string
    amount: "1" | "2" | "3" | "4" | "5"
}

function ProductDetails() {
    const { id } = useParams()

    const product = products.find((item: ProductDetails) => item.id === Number(id))
    return (
        <div>
            <div>
                <img src="" alt="" />
            </div>
            <div>
                <h1></h1>
                <h3></h3>
                <h3></h3>
                <p></p>
                <h3></h3>
                <label>Amount</label>
                <select name="" id="">
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                </select>
                <button></button>

            </div>
        </div>
    )
}

export default ProductDetails