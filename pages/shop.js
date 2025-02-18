import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Sun, Moon } from "lucide-react";
import { useCart } from "../cartContext";

export default function Shop() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Salviamo la modalità notte nel localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const wines = [
    { id: 1, name: "Prosecco DOCG", price: 18, description: "Un ottimo prosecco dal sapore fruttato." },
    { id: 2, name: "Amarone della Valpolicella", price: 45, description: "Vino corposo con note di ciliegia e spezie." },
    { id: 3, name: "Chianti Classico", price: 22, description: "Equilibrato, con tannini morbidi e profumo intenso." },
  ];

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Negozio</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="flex mb-4">
        <Search size={24} className="mr-2" />
        <input
          type="text"
          placeholder="Cerca un vino..."
          className="p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wines
          .filter((wine) => wine.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((wine) => (
            <div key={wine.id} className="p-4 shadow-lg border rounded-lg">
              <h2 className="text-xl font-semibold">{wine.name}</h2>
              <p className="text-sm text-gray-600">{wine.description}</p>
              <p className="text-lg font-bold">€{wine.price}</p>
              <button
                onClick={() => addToCart(wine)}
                className="mt-2 w-full flex items-center bg-blue-500 text-white p-2 rounded-lg"
              >
                <ShoppingCart className="mr-2" size={16} /> Aggiungi al carrello
              </button>
            </div>
          ))}
      </div>
      <Link href="/cart">
        <button className="mt-6 bg-green-500 text-white p-3 rounded-lg">Vai al carrello</button>
      </Link>
    </div>
  );
}
