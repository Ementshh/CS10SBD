"use client";

import { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
  price: string;
  stock: number;
  created_at: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/items`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch items");
        }

        setItems(data.payload);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while fetching items");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [apiBaseUrl]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm sm:px-10">
        <div className="text-lg font-bold text-blue-600">SBD Store</div>
        <div className="flex gap-6 text-sm font-medium">
          <a href="/register" className="transition hover:text-blue-600">Register</a>  
          <a href="/login" className="transition hover:text-blue-600">Login</a>
        </div>
      </nav>

      <section id="home" className="px-6 py-8 sm:px-10">
        <h1 className="text-3xl font-bold text-slate-800">Daftar Barang</h1>
        <p className="mt-2 text-slate-600">Jelajahi produk yang tersedia di toko kami.</p>
      </section>

      <section id="cards" className="px-6 py-6 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-lg font-medium text-slate-500">Memuat data barang...</p>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-lg text-slate-500">Tidak ada barang yang dijual saat ini.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <article key={item.id} className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Stok: {item.stock}</span>
                    <span className="text-lg font-bold text-blue-600">
                      Rp {parseFloat(item.price).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <button className="mt-6 w-full rounded-md bg-blue-50 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100">
                  Beli
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
