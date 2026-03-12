"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";
import { setToken } from "@/lib/auth";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", username: "", first_name: "", last_name: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = isRegister ? await register(form) : await login(form.email, form.password);
      setToken(res.data.access_token);
      toast.success(isRegister ? "Account created!" : "Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-gray-100">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/"><h1 className="text-3xl font-bold text-brand-700">AuctionHub</h1></Link>
          <p className="text-gray-500 mt-2">{isRegister ? "Create your account" : "Sign in to your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="input-field" value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
                <input type="text" placeholder="Last Name" className="input-field" value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
              </div>
              <input type="text" placeholder="Username" className="input-field" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </>
          )}
          <input type="email" placeholder="Email" className="input-field" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" className="input-field" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-brand-600 font-medium hover:underline">
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
