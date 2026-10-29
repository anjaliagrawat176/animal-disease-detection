"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Lock,
  Mail,
  PawPrint,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password
    ) {
      alert(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
        await response.json();

      if (
        response.ok &&
        data.success
      ) {
        window.location.href =
          "/dashboard";
      } else {
        alert(
          data.message ||
            "Invalid email or password."
        );
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleSuccess = async (
    credentialResponse: any
  ) => {
    if (
      !credentialResponse?.credential
    ) {
      alert(
        "Google authentication failed."
      );
      return;
    }

    try {
      setGoogleLoading(true);

      const response = await fetch(
        "/api/auth/google",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            credential:
              credentialResponse.credential,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Google login response:",
        data
      );

      if (
        response.ok &&
        data.success
      ) {
        window.location.href =
          "/dashboard";
      } else {
        alert(
          data.message ||
            "Google login failed."
        );
      }
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      alert(
        "Unable to login with Google. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError =
    () => {
      console.error(
        "Google Login Failed"
      );

      setGoogleLoading(false);

      alert(
        "Google login was cancelled or failed."
      );
    };

  return (
    <GoogleOAuthProvider
      clientId={
        process.env
          .NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
      }
    >
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 py-6 sm:px-6 lg:px-8">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)] lg:grid-cols-2">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="relative hidden min-h-[700px] overflow-hidden bg-gradient-to-br from-[#0b3d2e] via-[#116149] to-[#1f9d7a] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

            {/* Decorative circles */}

            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/[0.06]" />

            <div className="absolute -bottom-32 -left-28 h-96 w-96 rounded-full bg-white/[0.06]" />

            <div className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-emerald-300/[0.08]" />

            <div className="relative z-10">

              {/* Logo */}

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <PawPrint
                    size={27}
                    strokeWidth={1.8}
                  />
                </div>

                <div>

                  <h2 className="text-lg font-bold tracking-wide">
                    AnimalCare
                  </h2>

                  <p className="text-xs text-emerald-100">
                    Disease Detection System
                  </p>

                </div>

              </div>

              {/* Main Content */}

              <div className="mt-24 max-w-lg">

                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
                  Welcome Back
                </p>

                <h1 className="text-5xl font-bold leading-[1.12] xl:text-[52px]">

                  Better care.
                  <br />

                  <span className="text-emerald-200">
                    Healthier
                  </span>

                  <br />

                  animals.

                </h1>

                <p className="mt-7 max-w-md text-[15px] leading-7 text-emerald-50/90">
                  Access your animal health
                  records and use our
                  AI-powered disease detection
                  system to monitor animal
                  health.
                </p>

              </div>

              {/* Features */}

              <div className="mt-10 space-y-5">

                <Feature
                  icon={
                    <Activity size={17} />
                  }
                  text="AI-powered disease detection"
                />

                <Feature
                  icon={
                    <PawPrint size={17} />
                  }
                  text="Manage animal health records"
                />

                <Feature
                  icon={
                    <ShieldCheck size={17} />
                  }
                  text="Secure user account"
                />

              </div>

            </div>

            {/* Footer */}

            <div className="relative z-10 border-t border-white/15 pt-5">

              <p className="text-xs text-emerald-100/80">
                © 2026 AnimalCare •
                Animal Health Management
              </p>

            </div>

          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <section className="flex min-h-[700px] flex-col justify-center bg-white px-6 py-10 sm:px-10 md:px-14 lg:px-12 xl:px-16">

            {/* Mobile Logo */}

            <div className="mb-10 flex items-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">

                <PawPrint size={24} />

              </div>

              <div>

                <h2 className="font-bold text-gray-800">
                  AnimalCare
                </h2>

                <p className="text-xs text-emerald-600">
                  Disease Detection System
                </p>

              </div>

            </div>

            {/* Heading */}

            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Welcome Back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-[34px]">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter your credentials or
                continue with Google to access
                your animal health dashboard.
              </p>

            </div>

            {/* =================================================
                GOOGLE LOGIN
            ================================================= */}

            <div className="mb-7">

              <div className="flex justify-center">

                {googleLoading ? (

                  <div className="flex h-11 w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-500 sm:w-auto sm:min-w-[300px]">

                    Signing in with Google...

                  </div>

                ) : (

                  <div className="w-full sm:w-auto">

                    <GoogleLogin
                      onSuccess={
                        handleGoogleSuccess
                      }
                      onError={
                        handleGoogleError
                      }
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      width="320"
                    />

                  </div>

                )}

              </div>

            </div>

            {/* Divider */}

            <div className="mb-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-medium text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>

            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Email */}

              <InputField
                label="Email Address"
                icon={
                  <Mail size={18} />
                }
                type="email"
                name="email"
                placeholder="you@example.com"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
              />

              {/* Password */}

              <InputField
                label="Password"
                icon={
                  <Lock size={18} />
                }
                type="password"
                name="password"
                placeholder="Enter your password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
              />

              {/* Remember + Forgot */}

              <div className="flex items-center justify-between">

                <label className="flex cursor-pointer items-center gap-2">

                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-emerald-600"
                  />

                  <span className="text-xs text-gray-500">
                    Remember me
                  </span>

                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#169b80] to-[#168c73] py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-emerald-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
              >

                {loading
                  ? "Signing In..."
                  : "Sign In"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>

            {/* Register */}

            <p className="mt-8 text-center text-sm text-gray-500">

              Don't have an account?{" "}

              <Link
                href="/register"
                className="font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline"
              >
                Create account
              </Link>

            </p>

            {/* Security note */}

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400">

              <ShieldCheck
                size={13}
                className="text-emerald-600"
              />

              Secure authentication powered by
              AnimalCare

            </div>

          </section>

        </div>

      </main>
    </GoogleOAuthProvider>
  );
}

/* =========================================================
   FEATURE
========================================================= */

type FeatureProps = {
  icon: ReactNode;
  text: string;
};

function Feature({
  icon,
  text,
}: FeatureProps) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-100 backdrop-blur-sm">
        {icon}
      </div>

      <p className="text-sm font-medium text-emerald-50">
        {text}
      </p>

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

type InputFieldProps = {
  label: string;
  icon: ReactNode;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

function InputField({
  label,
  icon,
  type,
  name,
  placeholder,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="w-full">

      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <div className="group relative">

        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-emerald-600">
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
        />

      </div>

    </div>
  );
}