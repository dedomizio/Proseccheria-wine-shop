import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Cart() {
  const [cart, setCart] = useState([]);

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <PayPalScriptProvider options={{ "client-id": "test" }}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Carrello</h1>
        {cart.length > 0 ? (
          <>
            <ul className="mt-2">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between border-b py-2 items-center">
                  {item.name} - €{item.price}
                  <button onClick={() => removeFromCart(index)} className="ml-4 bg-red-500 text-white p-1 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold mt-4">Totale: €{totalAmount}</p>
            <div className="mt-4">
              <PayPalButtons
                style={{ layout: "horizontal" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{ amount: { value: totalAmount.toFixed(2) } }],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then(() => {
                    alert("Pagamento completato!");
                    setCart([]);
                  });
                }}
              />
            </div>
          </>
        ) : (
          <p className="text-gray-500">Il carrello è vuoto</p>
        )}
        <Link href="/shop">
          <button className="mt-6 bg-blue-500 text-white p-3 rounded-lg">Torna al negozio</button>
        </Link>
      </div>
    </PayPalScriptProvider>
  );
}
