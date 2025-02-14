import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle, Trash2, Upload } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const initialWines = [
  { id: 1, name: "Prosecco DOCG", price: 18, image: "", description: "Un ottimo prosecco dal sapore fruttato.", fileName: "" },
  { id: 2, name: "Amarone della Valpolicella", price: 45, image: "", description: "Vino corposo con note di ciliegia e spezie.", fileName: "" },
  { id: 3, name: "Chianti Classico", price: 22, image: "", description: "Equilibrato, con tannini morbidi e profumo intenso.", fileName: "" },
];

export default function WineShop() {
  const [cart, setCart] = useState([]);
  const [wines, setWines] = useState(initialWines);

  const addToCart = (wine) => {
    setCart([...cart, wine]);
  };
  
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };
  
  const handleImageUpload = (event, wineId) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWines(wines.map(wine => 
          wine.id === wineId ? { ...wine, image: reader.result, fileName: file.name } : wine
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <PayPalScriptProvider options={{ "client-id": "test" }}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Shop - Proseccheria</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wines.map((wine) => (
            <Card key={wine.id} className="p-4 shadow-lg">
              {wine.image ? (
                <>
                  <img src={wine.image} alt={wine.name} className="w-full h-48 object-cover mb-2 rounded-xl" />
                  <p className="text-sm text-gray-500 mb-2">{wine.fileName}</p>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-48 bg-gray-200 rounded-xl mb-2">
                  <Upload size={24} />
                  <span className="text-sm text-gray-500 mt-1">Carica immagine</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, wine.id)} />
                </label>
              )}
              <CardContent>
                <h2 className="text-xl font-semibold">{wine.name}</h2>
                <p className="text-sm text-gray-600">{wine.description}</p>
                <p className="text-lg font-bold">€{wine.price}</p>
                <Button onClick={() => addToCart(wine)} className="mt-2 w-full flex items-center">
                  <ShoppingCart className="mr-2" size={16} /> Aggiungi al carrello
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-bold">Carrello</h2>
          {cart.length > 0 ? (
            <>
              <ul className="mt-2">
                {cart.map((item, index) => (
                  <li key={index} className="flex justify-between border-b py-2 items-center">
                    {item.name} - €{item.price}
                    <Button variant="outline" size="icon" onClick={() => removeFromCart(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
              <p className="text-lg font-bold mt-4">Totale: €{totalAmount}</p>
              <div className="mt-4">
                <PayPalButtons style={{ layout: "horizontal" }} createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{ amount: { value: totalAmount.toFixed(2) } }],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then(() => {
                    alert("Pagamento completato!");
                    setCart([]);
                  });
                }} />
              </div>
            </>
          ) : (
            <p className="text-gray-500">Il carrello è vuoto</p>
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
