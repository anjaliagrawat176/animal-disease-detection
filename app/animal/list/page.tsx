"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  HeartPulse,
  PawPrint,
  Plus,
  RefreshCw,
  UserRound,
} from "lucide-react";

type Animal = {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  age: number | null;
  gender: string | null;
  healthStatus: string | null;
  userId: string;
  createdAt: string;
};

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/animal/add", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAnimals(result.data);
      } else {
        setError(result.message || "Unable to load animals.");
      }
    } catch (error) {
      console.error("Fetch Animals Error:", error);
      setError("Something went wrong while loading animals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const getAnimalIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "dog":
        return "🐕";
      case "cat":
        return "🐈";
      case "cow":
        return "🐄";
      case "buffalo":
        return "🐃";
      case "goat":
        return "🐐";
      case "sheep":
        return "🐑";
      default:
        return "🐾";
    }
  };

  const getHealthStyle = (status: string | null) => {
    switch (status) {
      case "Needs Attention":
        return {
          wrapper: "border-amber-200 bg-amber-50",
          text: "text-amber-700",
          dot: "bg-amber-500",
        };

      case "Under Treatment":
        return {
          wrapper: "border-sky-200 bg-sky-50",
          text: "text-sky-700",
          dot: "bg-sky-500",
        };

      default:
        return {
          wrapper: "border-emerald-200 bg-emerald-50",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
        };
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8f6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= TOP NAV ================= */}
        <div className="mb-6 flex items-center justify-between">

          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-[#315c4e] transition hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Dashboard
          </Link>

          {/* FIXED: Add Animal -> /animal */}
          <Link
            href="/animal"
            className="inline-flex items-center gap-2 rounded-xl bg-[#17634d] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_7px_20px_rgba(23,99,77,0.22)] transition hover:-translate-y-0.5 hover:bg-[#125541]"
          >
            <Plus size={17} />
            Add Animal
          </Link>

        </div>

        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden rounded-[26px] bg-[#082a22] shadow-[0_14px_35px_rgba(8,42,34,0.18)]">

          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#164f3f]/40" />

          <div className="pointer-events-none absolute -bottom-20 right-32 h-44 w-44 rounded-full bg-[#2c755d]/15" />

          <div className="relative flex flex-col justify-between gap-5 px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:px-9">

            {/* Hero text */}
            <div>

              <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-[10px] font-semibold tracking-wide text-[#b9dfcf]">
                <PawPrint size={13} />
                ANIMAL MANAGEMENT
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                Manage your animals
              </h1>

              <p className="mt-1.5 max-w-xl text-xs leading-5 text-[#c9ded7]/70 sm:text-sm">
                Keep your registered animals, health information and important
                details organized in one place.
              </p>

            </div>

            {/* Total Animals */}
            <div className="w-full shrink-0 lg:w-[190px]">

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur-sm">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3c9474]/15 text-[#91d5b7]">
                  <PawPrint size={20} />
                </div>

                <div>
                  <p className="text-xl font-bold leading-none text-white">
                    {animals.length}
                  </p>

                  <p className="mt-1 text-[10px] text-[#c9ded7]/65">
                    Registered Animals
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ================= CONTENT HEADER ================= */}
        {!loading && !error && animals.length > 0 && (
          <div className="mb-5 mt-8 flex items-end justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6c8c80]">
                Your Collection
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#203b33]">
                All Animals
              </h2>
            </div>

            <span className="hidden rounded-full border border-[#dce9e3] bg-white px-3 py-1.5 text-xs font-semibold text-[#547368] sm:block">
              {animals.length}{" "}
              {animals.length === 1 ? "Animal" : "Animals"}
            </span>

          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="mt-8 flex min-h-[340px] items-center justify-center rounded-[28px] border border-[#dbe8e2] bg-white shadow-sm">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f4ed] text-[#23765a]">
                <RefreshCw
                  size={27}
                  className="animate-spin"
                />
              </div>

              <h3 className="mt-5 text-sm font-bold text-[#31584b]">
                Loading your animals
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Fetching your animal records...
              </p>

            </div>

          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="mt-8 rounded-[28px] border border-red-100 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <RefreshCw size={26} />
            </div>

            <h3 className="mt-5 font-bold text-red-600">
              Unable to load animals
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {error}
            </p>

            <button
              onClick={fetchAnimals}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17634d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125541]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && !error && animals.length === 0 && (
          <div className="mt-8 rounded-[30px] border border-[#dbe8e2] bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#e1f3ea] to-[#f3faf6] text-[#24765a]">
              <PawPrint size={35} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#203b33]">
              No animals yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Start building your animal records by adding your first
              animal. You can track its basic information and health status.
            </p>

            {/* FIXED: Add Your First Animal -> /animal */}
            <Link
              href="/animal"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#17634d] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(23,99,77,0.18)] transition hover:-translate-y-0.5 hover:bg-[#125541]"
            >
              <Plus size={17} />
              Add Your First Animal
            </Link>

          </div>
        )}

        {/* ================= ANIMAL GRID ================= */}
        {!loading && !error && animals.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {animals.map((animal) => {
              const health = getHealthStyle(animal.healthStatus);

              return (
                <article
                  key={animal.id}
                  className="group overflow-hidden rounded-[26px] border border-[#dbe8e2] bg-white shadow-[0_8px_28px_rgba(30,80,65,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c5ddd2] hover:shadow-[0_18px_40px_rgba(30,80,65,0.11)]"
                >

                  {/* CARD TOP */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#eaf7f0] via-[#f5faf7] to-white px-5 pb-5 pt-6">

                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#d7eee3]" />

                    <div className="relative flex items-start justify-between">

                      <div className="flex items-center gap-4">

                        <div className="flex h-[66px] w-[66px] items-center justify-center rounded-[20px] border border-white bg-white text-[36px] shadow-[0_8px_20px_rgba(35,90,70,0.09)] transition-transform duration-300 group-hover:scale-105">
                          {getAnimalIcon(animal.type)}
                        </div>

                        <div>
                          <h2 className="max-w-[150px] truncate text-lg font-bold text-[#203b33]">
                            {animal.name}
                          </h2>

                          <p className="mt-1 text-xs font-medium text-[#66877b]">
                            {animal.type}
                            {animal.breed
                              ? ` • ${animal.breed}`
                              : ""}
                          </p>
                        </div>

                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[#9bc6b5] shadow-sm">
                        <PawPrint size={18} />
                      </div>

                    </div>

                    {/* HEALTH */}
                    <div className="relative mt-5 flex items-center justify-between">

                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold ${health.wrapper} ${health.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${health.dot}`}
                        />

                        <HeartPulse size={13} />

                        {animal.healthStatus || "Healthy"}
                      </div>

                    </div>

                  </div>

                  {/* CARD DETAILS */}
                  <div className="p-5">

                    <div className="space-y-3">

                      {/* AGE */}
                      <div className="flex items-center justify-between rounded-2xl border border-[#edf2ef] bg-[#fafcfb] px-4 py-3">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf5ef] text-[#3a8068]">
                            <Activity size={16} />
                          </div>

                          <span className="text-xs font-medium text-slate-500">
                            Age
                          </span>

                        </div>

                        <span className="text-sm font-bold text-[#30483f]">
                          {animal.age !== null
                            ? `${animal.age} years`
                            : "Not added"}
                        </span>

                      </div>

                      {/* GENDER */}
                      <div className="flex items-center justify-between rounded-2xl border border-[#edf2ef] bg-[#fafcfb] px-4 py-3">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf5ef] text-[#3a8068]">
                            <UserRound size={16} />
                          </div>

                          <span className="text-xs font-medium text-slate-500">
                            Gender
                          </span>

                        </div>

                        <span className="text-sm font-bold capitalize text-[#30483f]">
                          {animal.gender || "Not added"}
                        </span>

                      </div>

                      {/* ADDED DATE */}
                      <div className="flex items-center justify-between rounded-2xl border border-[#edf2ef] bg-[#fafcfb] px-4 py-3">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf5ef] text-[#3a8068]">
                            <CalendarDays size={16} />
                          </div>

                          <span className="text-xs font-medium text-slate-500">
                            Added On
                          </span>

                        </div>

                        <span className="text-sm font-bold text-[#30483f]">
                          {new Date(
                            animal.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                    </div>

                    {/* FOOTER */}
                    <div className="mt-5 flex items-center justify-between border-t border-[#edf2ef] pt-4">

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Animal ID
                        </p>

                        <p className="mt-1 max-w-[150px] truncate font-mono text-[10px] text-slate-500">
                          {animal.id}
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f7f3] text-[#5c927e] transition group-hover:bg-[#17634d] group-hover:text-white">
                        <ChevronRight size={17} />
                      </div>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="mt-10 border-t border-[#dfeae5] pb-3 pt-5 text-center">

          <p className="text-[11px] font-medium tracking-wide text-slate-400">
            AnimalCare
            <span className="mx-2 text-[#8ab8a5]">•</span>
            Animal Disease Detection System
          </p>

        </div>

      </div>
    </main>
  );
}