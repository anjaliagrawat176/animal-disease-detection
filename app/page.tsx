"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Activity,
} from "lucide-react";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#071d18] text-white">
      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="border-b border-white/10 bg-[#071d18]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2b8063] to-[#17634d] shadow-lg shadow-[#17634d]/20">
              <PawPrint
                size={23}
                strokeWidth={2}
              />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                AnimalCare
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#83bca8]">
                Animal Health
              </p>
            </div>
          </Link>

          {/* NAV BUTTONS */}

          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#c9e6da] transition hover:bg-white/5 hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-[#28775c] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#17634d]/20 transition hover:bg-[#31876a] sm:px-5"
            >
              <span className="hidden sm:inline">
                Create Account
              </span>

              <span className="sm:hidden">
                Register
              </span>
            </Link>

          </div>
        </div>
      </nav>

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="relative overflow-hidden">

        {/* Decorative circles */}

        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-[#2b8063]/20 bg-[#2b8063]/5" />

        <div className="absolute -left-52 top-60 h-[500px] w-[500px] rounded-full border border-white/5" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pb-28 lg:pt-24">

          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

            {/* =========================
                LEFT CONTENT
            ========================= */}

            <div>

              {/* BADGE */}

              <div className="inline-flex items-center gap-2 rounded-full border border-[#2b8063]/30 bg-[#12372d] px-4 py-2">

                <Sparkles
                  size={15}
                  className="text-[#8bd0b2]"
                />

                <span className="text-xs font-semibold text-[#b8d8cc]">
                  Smart Animal Health Assistant
                </span>

              </div>

              {/* HEADING */}

              <h2 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">

                Better Care for

                <span className="block text-[#65b892]">
                  Every Animal.
                </span>

              </h2>

              {/* DESCRIPTION */}

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#a9c8bc] sm:text-lg">
                AnimalCare helps you manage your animals,
                explore disease information, and use AI-powered
                disease screening to understand possible health
                concerns quickly and easily.
              </p>

              {/* BUTTONS */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#17634d] to-[#2b8063] px-6 py-4 text-sm font-bold text-white shadow-[0_15px_35px_rgba(23,99,77,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(23,99,77,0.35)]"
                >
                  Get Started

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-[#d4e8df] transition hover:bg-white/10"
                >
                  Login to Continue
                </Link>

              </div>

              {/* TRUST POINTS */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={16}
                    className="text-[#65b892]"
                  />

                  <span className="text-xs text-[#9fbbb0]">
                    Easy animal management
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={16}
                    className="text-[#65b892]"
                  />

                  <span className="text-xs text-[#9fbbb0]">
                    AI-assisted screening
                  </span>

                </div>

              </div>

            </div>

            {/* =========================
                RIGHT VISUAL
            ========================= */}

            <div className="relative">

              {/* Glow */}

              <div className="absolute inset-10 rounded-full bg-[#28775c]/20 blur-3xl" />

              {/* Main card */}

              <div className="relative mx-auto max-w-[470px]">

                <div className="overflow-hidden rounded-[34px] border border-[#2d594d] bg-gradient-to-br from-[#103b30] via-[#164c3b] to-[#1f654e] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">

                  {/* Top */}

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fcab1]">
                        Animal Health
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        Care Dashboard
                      </h3>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                      <HeartPulse size={22} />
                    </div>

                  </div>

                  {/* Animal Illustration Area */}

                  <div className="relative mt-7 flex h-[250px] items-center justify-center overflow-hidden rounded-[26px] border border-white/10 bg-[#0c2b23]">

                    <div className="absolute h-48 w-48 rounded-full bg-[#2b8063]/20 blur-2xl" />

                    <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[#65b892]/20 bg-[#174737]">

                      <div className="text-7xl">
                        🐾
                      </div>

                    </div>

                    {/* Floating cards */}

                    <div className="absolute left-4 top-5 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">

                      <div className="flex items-center gap-2">

                        <ShieldCheck
                          size={15}
                          className="text-[#8bd0b2]"
                        />

                        <span className="text-[10px] font-semibold text-white/80">
                          Health Protected
                        </span>

                      </div>

                    </div>

                    <div className="absolute bottom-5 right-4 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">

                      <div className="flex items-center gap-2">

                        <Activity
                          size={15}
                          className="text-[#8bd0b2]"
                        />

                        <span className="text-[10px] font-semibold text-white/80">
                          Health Tracking
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Bottom Stats */}

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                      <div className="flex items-center gap-2">

                        <PawPrint
                          size={16}
                          className="text-[#8bd0b2]"
                        />

                        <span className="text-[10px] font-medium text-white/60">
                          My Animals
                        </span>

                      </div>

                      <p className="mt-2 text-lg font-bold">
                        Manage
                      </p>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                      <div className="flex items-center gap-2">

                        <HeartPulse
                          size={16}
                          className="text-[#8bd0b2]"
                        />

                        <span className="text-[10px] font-medium text-white/60">
                          Disease
                        </span>

                      </div>

                      <p className="mt-2 text-lg font-bold">
                        Detect
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================= */}

      <section className="border-t border-white/5 bg-[#081f19]">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#72b99b]">
              Everything You Need
            </p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Simple tools for better animal care
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#91b1a5]">
              Keep your animal information organized and
              get useful health insights from one place.
            </p>

          </div>

          {/* Feature Cards */}

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {/* CARD 1 */}

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#2b8063]/40 hover:bg-white/[0.05]">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#174737] text-[#78c19f]">

                <PawPrint size={23} />

              </div>

              <h3 className="mt-5 text-lg font-bold">
                Manage Animals
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#91b1a5]">
                Add your animals and maintain important
                information such as breed, age, gender,
                health status, and photos.
              </p>

            </div>

            {/* CARD 2 */}

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#2b8063]/40 hover:bg-white/[0.05]">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#174737] text-[#78c19f]">

                <Sparkles size={23} />

              </div>

              <h3 className="mt-5 text-lg font-bold">
                AI Disease Screening
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#91b1a5]">
                Analyze an animal photo together with
                reported symptoms to identify possible
                matches from your disease library.
              </p>

            </div>

            {/* CARD 3 */}

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#2b8063]/40 hover:bg-white/[0.05]">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#174737] text-[#78c19f]">

                <Stethoscope size={23} />

              </div>

              <h3 className="mt-5 text-lg font-bold">
                Disease Information
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#91b1a5]">
                Explore symptoms, prevention information,
                and general treatment guidance for diseases
                available in your database.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}

      <section className="bg-[#071d18] px-5 py-16 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-[30px] border border-[#2b8063]/30 bg-gradient-to-r from-[#103b30] to-[#1c604a] px-6 py-12 text-center shadow-[0_25px_70px_rgba(0,0,0,0.25)] sm:px-10">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">

            <HeartPulse size={28} />

          </div>

          <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
            Start caring smarter today
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#c2ded2]">
            Create your AnimalCare account and keep your
            animal health information organized in one place.
          </p>

          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#17634d] transition hover:-translate-y-0.5 hover:bg-[#effaf5]"
          >
            Create Your Account
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="border-t border-white/10 bg-[#061914]">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row sm:px-8 lg:px-10">

          <div className="flex items-center gap-2">

            <PawPrint
              size={16}
              className="text-[#65b892]"
            />

            <span className="text-xs font-semibold text-[#91b1a5]">
              AnimalCare
            </span>

          </div>

          <p className="text-center text-[11px] text-[#617f74]">
            Animal Disease Detection System
          </p>

          <p className="text-[11px] text-[#617f74]">
            © {new Date().getFullYear()} AnimalCare
          </p>

        </div>

      </footer>
    </main>
  );
}