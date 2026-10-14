import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Account from "./Account";
import Header from "./Header";
import OrderSummary from "./OrderSummary";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useOrderStore from "../zustandStore/orderStore";
import useShopStore from "../zustandStore/shopStore";
import useAuthStore from "../zustandStore/authStore";

const shippingSchema = z.object({
  firstName: z.string().trim().min(3, "Enter Your First Name"),
  address: z.string().trim().min(5, "Enter Your Address"),
});

type ShippingForm = z.infer<typeof shippingSchema>;

function Checkout() {
  const carts = useShopStore((state) => state.cart);
  const user = useAuthStore((state) => state.currentUser);

  const cartKey = user ? `user:${user.email.toLowerCase()}` : "guest";

  const cart = carts[cartKey] ? carts[cartKey] : [];

  const removeFromCart = useShopStore((state) => state.removeFromCart);

  const addOrder = useOrderStore((state) => state.addOrder);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      address: "",
    },
  });

  const handlePlaceOrder = (data: ShippingForm) => {
    const subtotal = cart.reduce((total, item) => {
      const price = Number(item.price.replace(/[^\d.-]/g, ""));
      return total + price * item.amount;
    }, 0);

    const shipping = subtotal === 0 || subtotal >= 1000 ? 0 : 15;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const order = {
      id: Date.now().toString(),
      name: `${data.firstName}`,
      address: `${data.address}`,
      products: cart.map((item) => `${item.amount}`),
      cost: total,
      dateTime: new Date().toString(),
    };

    addOrder(order);

    cart.forEach((item) => {
      removeFromCart(item.id);
    });

    toast.success("Order placed successfully!");

    navigate("/orders");
  };

  return (
    <div>
      <Account />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold">Place Your Order</h1>
        {cart.length === 0 ? (
          <div className="flex flex-1 w-full justify-items-start">
            <p className="rounded-xl p-8 text-center font-bold text-2xl">
              Your cart is empty
            </p>
            <hr className=" border-b border-border" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handlePlaceOrder)}>
            <div className="grid grid-8 lg:grid-cols-[1fr_22rem]">
              <section className="rounded-xl border-border p-6">
                <h2 className="mb-6 text-xl font-bold">Shipping Information</h2>
                <div className="w-100 flex flex-1 flex-col gap-10">
                  <div className="flex flex-1 flex-col gap-2">
                    <label htmlFor="">First Name</label>
                    <input
                      type="text"
                      {...register("firstName")}
                      placeholder="Enter First Name"
                      className="border-2 rounded h-10 border-primary-light"
                    />
                    {errors.firstName && (
                      <p className="text-red">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <label htmlFor="">Address</label>
                    <input
                      type="text"
                      {...register("address")}
                      placeholder="Enter Address"
                      className="border-2 rounded h-10 border-primary-light"
                    />
                    {errors.address && (
                      <p className="text-red">{errors.address.message}</p>
                    )}
                  </div>
                  <Button type="submit">Place Your Order</Button>
                </div>
              </section>
              <OrderSummary />
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default Checkout;
