import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold">Benvenuto alla Proseccheria</h1>
      <p className="mt-4 text-lg">Scopri i nostri migliori vini e acquista direttamente online!</p>
      <Link href="/shop">
        <button className="mt-6 bg-blue-500 text-white p-3 rounded-lg">Vai al negozio</button>
      </Link>
    </div>
  );
}
