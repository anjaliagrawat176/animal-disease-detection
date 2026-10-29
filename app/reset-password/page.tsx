"use client";

import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
  Lock,
  PawPrint,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid reset link.");
      return;
    }

    if (!password || !confirmpassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
            confirmpassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert(
          "Password reset successfully! Please login."
        );

        window.location.href = "/login";
      } else {
        alert(
          data.message ||
            "Unable to reset password."
        );
      }
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 py-8">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="mb-8 flex justify-center">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b3d2e] to-[#169b80] text-white shadow-sm">
              <PawPrint size={26} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                AnimalCare
              </h1>

              <p className="text-xs text-emerald-600">
                Disease Detection System
              </p>
            </div>

          </div>

        </div>

        {/* Card */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <KeyRound size={25} />
          </div>

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-gray-900">
              Reset Password
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Create a new password for your
              AnimalCare account.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* New Password */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-800">
                New Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Confirm Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  value={confirmpassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#169b80] to-[#168c73] py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <KeyRound size={17} />

              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>

          </form>

          <Link
            href="/login"
            className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-emerald-600"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

        </div>

      </div>

    </main>
  );
}