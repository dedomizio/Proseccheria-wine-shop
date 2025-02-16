import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Search } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState([
    { name: "Marco", rating: 5, comment: "Vini eccellenti e servizio impeccabile!" },
    { name: "Laura", rating: 4, comment: "Ottima selezione di vini!" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div 
      className="p-6" 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-4">Contatti</h1>
      <p className="text-lg">Vuoi metterti in contatto con noi? Ecco come puoi farlo:</p>
      <ul className="mt-4">
        <li><strong>Email:</strong> info@proseccheria.com</li>
        <li><strong>Telefono:</strong> +39 123 456 7890</li>
        <li><strong>Indirizzo:</strong> Via dei Vini, 12, Venezia, Italia</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-6">Scrivici un messaggio</h2>
      {!submitted ? (
        <motion.form 
          onSubmit={handleSubmit} 
          className="mt-4 flex flex-col"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Il tuo nome"
            className="p-2 mb-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="La tua email"
            className="p-2 mb-2 border rounded"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Il tuo messaggio"
            className="p-2 mb-2 border rounded"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <motion.button 
            type="submit" 
            className="bg-green-500 text-white p-3 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Invia Messaggio
          </motion.button>
        </motion.form>
      ) : (
        <motion.p 
          className="text-green-500 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Grazie per averci contattato! Ti risponderemo al più presto.
        </motion.p>
      )}
      
      <h2 className="text-2xl font-bold mt-6">Recensioni dei clienti</h2>
      <input
        type="text"
        placeholder="Cerca recensioni..."
        className="p-2 border rounded mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mt-4">
        {reviews
          .filter((review) =>
            review.comment.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((review, index) => (
            <div key={index} className="border p-4 rounded-lg mb-2">
              <p className="font-bold">{review.name}</p>
              <div className="flex">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500" />
                ))}
              </div>
              <p className="mt-1">{review.comment}</p>
            </div>
        ))}
      </div>
      
      <Link href="/">
        <motion.button 
          className="mt-6 bg-blue-500 text-white p-3 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Torna alla home
        </motion.button>
      </Link>
    </motion.div>
  );
}
