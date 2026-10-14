import { useParams } from "react-router-dom";
import { products } from "../data/productsdata";
import { useState } from "react";
import Account from "./Account";
import Header from "./Header";
import ColorSelector from "./ColorSelector";
import { toast } from "sonner";
import useShopStore from "../zustandStore/shopStore";

type ProductDetails = {
  id: number;
  image: string;
  name: string;
  company: string;
  category: "kids" | "beds" | "sofa" | "chairs";
  free_shipping: boolean;
  price: string;
  description: string;
  amount: "1" | "2" | "3" | "4" | "5";
};

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item: ProductDetails) => item.id === Number(id),
  );

  const [amount, setAmount] = useState("1");

  const addToCart = useShopStore((state) => state.addToCart);


  const selectedColor = useShopStore((state) => state.selectedColor);

  if (!product) {
    return <h2>Product Not Found</h2>;
  }

  return (
    <div>
      <div>
        <Account />
        <Header />
      </div>
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="w-full md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="h-96 w-full rounded-3xl border-8 border-primary-dark object-cover"
            />
          </div>
          <div className="mt-25 flex w-full flex-col items-start gap-5 md:w-1/2">
            <h1 className="text-4xl font-extrabold text-text-light">
              {product.name}
            </h1>

            <h3 className="text-lg text-muted-text">{product.company}</h3>

            <p className="text-xl font-bold text-primary">{product.price}</p>

            <p className="leading-7 text-text-light">{product.description}</p>

            <h3 className="text-lg font-semibold text-text-light">Colors</h3>
            <ColorSelector />

            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="font-semibold">
                Amount
              </label>

              <select
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-24 rounded-lg border border-border bg-input-background p-2 text-heading"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <button
              type="button"
              className="rounded-2xl bg-primary px-6 py-4 font-bold text-on-primary hover:opacity-90"
              onClick={() => {
                (addToCart({
                  id: product.id,
                  image: product.image,
                  name: product.name,
                  company: product.company,
                  price: product.price,
                  amount: Number(amount),
                  color: selectedColor,
                }),
                  toast.success("added to cart..."));
              }}
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
