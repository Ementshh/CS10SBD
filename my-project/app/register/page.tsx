"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Register gagal. Silakan coba lagi.");
      }

      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat register.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
              Nomor Telepon
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Masukkan nomor telepon"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isLoading ? "Memproses..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-blue-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-blue-700 transition hover:text-blue-500 hover:underline">
            Login Sekarang
          </Link>
        </p>
      </section>
    </main>
  );
}
