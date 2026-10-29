"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, PawPrint } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setResetUrl("");

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.message || "Unable to create reset request."
        );
        return;
      }

      // API se resetUrl aa raha hai
      if (data.resetUrl) {
        setMessage(
          "Password reset link generated successfully."
        );

        setResetUrl(data.resetUrl);
      } else {
        setMessage(
          "Reset request created, but reset link could not be generated."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 py-8">

      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)] sm:p-10">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <PawPrint size={24} />
          </div>

          <div>
            <h1 className="font-bold text-gray-900">
              AnimalCare
            </h1>

            <p className="text-xs text-emerald-600">
              Disease Detection System
            </p>
          </div>

        </div>

        {/* Heading */}
        <div className="mb-7">

          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Account Recovery
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Forgot your password?
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Enter your registered email address to create a
            password reset request.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Email Address
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />

            </div>

          </div>

          {/* Continue */}
          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#169b80] to-[#168c73] py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-[1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >

            {loading ? "Processing..." : "Continue"}

            {!loading && (
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            )}

          </button>

        </form>

        {/* Message */}
        {message && (
          <div
            className={`mt-5 rounded-xl p-4 text-sm ${
              resetUrl
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Reset Password Button */}
        {resetUrl && (
          <Link
            href={resetUrl}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-700"
          >
            Continue to Reset Password

            <ArrowRight size={17} />
          </Link>
        )}

        {/* Back */}
        <Link
          href="/login"
          className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

      </div>

    </main>
  );
}