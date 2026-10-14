import Account from "./Account";
import Header from "./Header";
import useOrderStore from "../zustandStore/orderStore";

function Orders() {

  const orders = useOrderStore((state) => state.orders);

  return (
    <div>
      <Account />
      <Header />
      <main className="mx-auto max-w-7xl px-8 py-6">
        <h1 className="mb-4 font-bold text-2xl">Your Orders</h1>
        <hr className="mb-6 border-border" />
        <p className="mb-5">
          Total Orders : <span className="font-bold">{orders.length}</span>
        </p>
        {orders.length === 0 ? (
          <p>Place Orders</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border border-none">
            <table className="w-full min-w-175 text-left ">
              <thead className="bg-primary-light">
                <tr className="p-3 text-center">
                  <th className="p-2">Name</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Cost</th>
                  <th className="p-2">Data & Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr className="border-t-1.2 text-center p-3" key={order.id}>
                    <td className="p-2">{order.name}</td>
                    <td className="p-2">{order.address}</td>
                    <td className="p-2">{order.products}</td>
                    <td className="p-2">{order.cost}</td>
                    <td className="p-2">{order.dateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;
