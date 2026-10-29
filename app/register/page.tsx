"use client";

import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Mail,
  PawPrint,
  Phone,
  User,
  ShieldCheck,
  Activity,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    password: "",
    confirmpassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phoneno ||
      !formData.password ||
      !formData.confirmpassword
    ) {
      alert("Please fill all the fields.");
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Registration successful! Your account has been created.");

        setFormData({
          name: "",
          email: "",
          phoneno: "",
          password: "",
          confirmpassword: "",
        });
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f6] flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)] lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}

        <section className="relative hidden min-h-[720px] overflow-hidden bg-gradient-to-br from-[#0b3d2e] via-[#116149] to-[#1f9d7a] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

          {/* Decorative circles */}
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/[0.06]" />
          <div className="absolute -bottom-32 -left-28 h-96 w-96 rounded-full bg-white/[0.06]" />
          <div className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-emerald-300/[0.08]" />

          {/* Content */}
          <div className="relative z-10">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <PawPrint size={27} strokeWidth={1.8} />
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

            {/* Main Heading */}
            <div className="mt-24 max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
                Welcome to AnimalCare
              </p>

              <h1 className="text-5xl font-bold leading-[1.12] xl:text-[52px]">
                Protect their
                <br />

                <span className="text-emerald-200">
                  health.
                </span>

                <br />

                Improve their
                <br />

                <span className="text-white">
                  future.
                </span>
              </h1>

              <p className="mt-7 max-w-md text-[15px] leading-7 text-emerald-50/90">
                Keep your animal health records organized and
                identify possible diseases with our smart
                AI-powered platform.
              </p>
            </div>

            {/* Features */}
            <div className="mt-10 space-y-5">

              <Feature
                icon={<Activity size={17} />}
                text="AI-powered disease detection"
              />

              <Feature
                icon={<PawPrint size={17} />}
                text="Track and manage animal health"
              />

              <Feature
                icon={<ShieldCheck size={17} />}
                text="Secure and organized records"
              />

            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 border-t border-white/15 pt-5">
            <p className="text-xs text-emerald-100/80">
              © 2026 AnimalCare • Animal Health Management
            </p>
          </div>

        </section>

        {/* ================= RIGHT SIDE ================= */}

        <section className="flex min-h-[720px] flex-col justify-center bg-white px-6 py-10 sm:px-10 md:px-14 lg:px-12 xl:px-16">

          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">

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
              Get Started
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-[34px]">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Register to start managing your animal health records.
            </p>

          </div>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Full Name */}
            <InputField
              label="Full Name"
              icon={<User size={17} />}
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />

            {/* Email + Phone */}
            <div className="grid gap-5 sm:grid-cols-2">

              <InputField
                label="Email Address"
                icon={<Mail size={17} />}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              <InputField
                label="Phone Number"
                icon={<Phone size={17} />}
                type="tel"
                name="phoneno"
                placeholder="9876543210"
                value={formData.phoneno}
                onChange={handleChange}
              />

            </div>

            {/* Password + Confirm */}
            <div className="grid gap-5 sm:grid-cols-2">

              <InputField
                label="Password"
                icon={<Lock size={17} />}
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
              />

              <InputField
                label="Confirm Password"
                icon={<Lock size={17} />}
                type="password"
                name="confirmpassword"
                placeholder="Confirm password"
                value={formData.confirmpassword}
                onChange={handleChange}
              />

            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">

              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 accent-emerald-600"
              />

              <p className="text-xs leading-5 text-gray-500">
                I agree to the{" "}
                <span className="font-medium text-emerald-600">
                  Terms & Conditions
                </span>{" "}
                and understand that my information will be
                securely stored.
              </p>

            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#169b80] to-[#168c73] py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-emerald-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
            >

              {loading ? "Creating Account..." : "Create Account"}

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              )}

            </button>

          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-gray-500">

            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline"
            >
              Login here
            </Link>

          </p>

        </section>
      </div>
    </main>
  );
}


/* ================= FEATURE ================= */

type FeatureProps = {
  icon: ReactNode;
  text: string;
};

function Feature({ icon, text }: FeatureProps) {
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


/* ================= INPUT ================= */

type InputFieldProps = {
  label: string;
  icon: ReactNode;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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