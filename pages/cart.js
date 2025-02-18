import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "../cartContext";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_12345"); // ⚠️ Usa la tua chiave Stripe

function CheckoutForm({ totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(card);

    if (error) {
      alert(error.message);
    } else {
      alert("Pagamento con carta completato! Token: " + token.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 border p-4 rounded-lg">
      <CardElement className="p-2 border rounded" />
      <button type="submit" className="mt-4 bg-blue-500 text-white p-3 rounded-lg" disabled={!stripe}>
        Paga con Carta
      </button>
    </form>
  );
}

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const [paymentMethod, setPaymentMethod] = useState("paypal");

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
            
            <h2 className="text-xl font-bold mt-6">Scegli il metodo di pagamento</h2>
            <div className="flex gap-4 mt-2">
              <button onClick={() => setPaymentMethod("paypal")} className={`p-2 rounded-lg ${paymentMethod === "paypal" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                PayPal
              </button>
              <button onClick={() => setPaymentMethod("card")} className={`p-2 rounded-lg ${paymentMethod === "card" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                Carta di Credito
              </button>
              <button onClick={() => setPaymentMethod("store")} className={`p-2 rounded-lg ${paymentMethod === "store" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                Ritiro in Negozio
              </button>
            </div>
            
            <div className="mt-4">
              {paymentMethod === "paypal" && (
                <PayPalButtons
                  style={{ layout: "horizontal" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{ amount: { value: totalAmount.toFixed(2) } }],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then(() => {
                      alert("Pagamento con PayPal completato!");
                    });
                  }}
                />
              )}
              {paymentMethod === "card" && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm totalAmount={totalAmount} />
                </Elements>
              )}
              {paymentMethod === "store" && (
                <button onClick={() => alert("Ordine confermato per il ritiro in negozio!")} className="mt-4 bg-green-500 text-white p-3 rounded-lg">
                  Conferma Ritiro in Negozio
                </button>
              )}
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
