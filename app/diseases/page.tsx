"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  ChevronDown,
  HeartPulse,
  Info,
  Loader2,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from "lucide-react";

type Disease = {
  id: string;
  name: string;
  description: string;
  symptoms: string;
  prevention: string;
  medicine: string;
};

export default function DiseasesInformationPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Which disease card is expanded
  const [openDiseaseId, setOpenDiseaseId] =
    useState<string | null>(null);

  // =========================
  // LOAD DISEASES
  // =========================

  useEffect(() => {
    loadDiseases();
  }, []);

  const loadDiseases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/diseasesdetails",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      console.log(
        "Diseases Information Response:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load diseases."
        );
      }

      setDiseases(data.data || []);
    } catch (error) {
      console.error(
        "Disease information error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading diseases."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TOGGLE DETAILS
  // =========================

  const toggleDisease = (
    diseaseId: string
  ) => {
    setOpenDiseaseId(
      (current) =>
        current === diseaseId
          ? null
          : diseaseId
    );
  };

  return (
    <main className="min-h-screen bg-[#071d18] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* =========================
            TOP BAR
        ========================= */}

        <div className="mb-6 flex items-center justify-between">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#c9e6da] transition hover:bg-white/5"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:flex">

            <ShieldCheck
              size={16}
              className="text-[#8bd0b2]"
            />

            <span className="text-xs font-semibold text-[#b8d8cc]">
              Animal Health Information
            </span>

          </div>

        </div>

        {/* =========================
            MAIN CARD
        ========================= */}

        <div className="overflow-hidden rounded-[30px] border border-[#234b40] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.25)]">

          {/* =========================
              HEADER
          ========================= */}

          <div className="relative overflow-hidden bg-gradient-to-r from-[#103b30] via-[#185943] to-[#28775c] px-6 py-10 text-white sm:px-10 lg:px-12">

            {/* Decorative circles */}

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5" />

            <div className="absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-white/[0.03]" />

            <div className="relative z-10 flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">

                <HeartPulse
                  size={29}
                  strokeWidth={1.8}
                />

              </div>

              <div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b8e4d1]">
                  Animal Health Guide
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Diseases Information
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d8eee4]/80">
                  Explore common animal diseases,
                  their symptoms, prevention methods,
                  and available treatment information.
                </p>

              </div>

            </div>

          </div>

          {/* =========================
              CONTENT
          ========================= */}

          <div className="bg-white p-6 sm:p-9 lg:p-12">

            {/* =========================
                ERROR
            ========================= */}

            {error && (
              <div className="mb-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">

                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <div>

                  <p>
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={loadDiseases}
                    className="mt-2 text-xs font-bold underline"
                  >
                    Try Again
                  </button>

                </div>

              </div>
            )}

            {/* =========================
                LOADING
            ========================= */}

            {loading ? (

              <div className="flex min-h-[400px] items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f4ed] text-[#23765a]">

                    <Loader2
                      size={28}
                      className="animate-spin"
                    />

                  </div>

                  <h2 className="mt-5 text-sm font-bold text-[#294d40]">
                    Loading diseases
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Fetching disease information...
                  </p>

                </div>

              </div>

            ) : diseases.length === 0 ? (

              /* =========================
                  NO DISEASES
              ========================= */

              <div className="py-16 text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#e6f4ed] text-[#26755a]">

                  <HeartPulse size={35} />

                </div>

                <h2 className="mt-6 text-xl font-bold text-[#203b33]">
                  No diseases found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  There is currently no disease
                  information available.
                </p>

                <button
                  type="button"
                  onClick={loadDiseases}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#17634d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#125541]"
                >
                  Refresh
                </button>

              </div>

            ) : (

              /* =========================
                  DISEASE LIST
              ========================= */

              <div>

                {/* LIST HEADER */}

                <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                      Disease Library
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-[#203b33]">
                      Available Diseases
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {diseases.length} disease
                      {diseases.length !== 1
                        ? "s"
                        : ""}{" "}
                      available in the database.
                    </p>

                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9e8e1] bg-[#f7fbf9] px-4 py-2">

                    <HeartPulse
                      size={16}
                      className="text-[#28755b]"
                    />

                    <span className="text-xs font-bold text-[#42675a]">
                      Health Information
                    </span>

                  </div>

                </div>

                {/* DISEASE CARDS */}

                <div className="grid gap-5 md:grid-cols-2">

                  {diseases.map(
                    (disease, index) => {

                      const isOpen =
                        openDiseaseId ===
                        disease.id;

                      return (
                        <div
                          key={disease.id}
                          className="overflow-hidden rounded-[24px] border border-[#dce9e3] bg-[#f9fcfa] transition hover:border-[#bcd9cb] hover:shadow-[0_12px_30px_rgba(23,99,77,0.08)]"
                        >

                          {/* CARD HEADER */}

                          <div className="p-5 sm:p-6">

                            <div className="flex items-start justify-between gap-4">

                              <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e2f2e9] text-[#28755b]">

                                  <HeartPulse
                                    size={23}
                                  />

                                </div>

                                <div>

                                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8aa49a]">
                                    Disease{" "}
                                    {index + 1}
                                  </p>

                                  <h3 className="mt-1 text-lg font-bold text-[#203b33]">
                                    {disease.name}
                                  </h3>

                                </div>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleDisease(
                                    disease.id
                                  )
                                }
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d9e8e1] bg-white text-[#50786a] transition hover:bg-[#edf7f1]"
                                aria-label={
                                  isOpen
                                    ? "Hide details"
                                    : "Show details"
                                }
                              >

                                <ChevronDown
                                  size={18}
                                  className={`transition-transform ${
                                    isOpen
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />

                              </button>

                            </div>

                            {/* DESCRIPTION */}

                            <p className="mt-5 text-sm leading-6 text-slate-600">
                              {disease.description}
                            </p>

                            {/* VIEW DETAILS */}

                            <button
                              type="button"
                              onClick={() =>
                                toggleDisease(
                                  disease.id
                                )
                              }
                              className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#28755b] transition hover:text-[#145a43]"
                            >
                              <Info size={15} />

                              {isOpen
                                ? "Hide Details"
                                : "View Full Details"}
                            </button>

                          </div>

                          {/* FULL DETAILS */}

                          {isOpen && (
                            <div className="border-t border-[#dce9e3] bg-white p-5 sm:p-6">

                              <div className="grid gap-4 sm:grid-cols-3">

                                {/* SYMPTOMS */}

                                <div className="rounded-2xl border border-[#e2ebe6] bg-[#f9fcfa] p-4">

                                  <div className="flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3eb] text-[#28755b]">

                                      <Stethoscope
                                        size={16}
                                      />

                                    </div>

                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#28755b]">
                                      Symptoms
                                    </h4>

                                  </div>

                                  <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {disease.symptoms ||
                                      "No symptom information available."}
                                  </p>

                                </div>

                                {/* PREVENTION */}

                                <div className="rounded-2xl border border-[#e2ebe6] bg-[#f9fcfa] p-4">

                                  <div className="flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3eb] text-[#28755b]">

                                      <ShieldCheck
                                        size={16}
                                      />

                                    </div>

                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#28755b]">
                                      Prevention
                                    </h4>

                                  </div>

                                  <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {disease.prevention ||
                                      "No prevention information available."}
                                  </p>

                                </div>

                                {/* MEDICINE */}

                                <div className="rounded-2xl border border-[#e2ebe6] bg-[#f9fcfa] p-4">

                                  <div className="flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3eb] text-[#28755b]">

                                      <Syringe
                                        size={16}
                                      />

                                    </div>

                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#28755b]">
                                      Medicine
                                    </h4>

                                  </div>

                                  <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {disease.medicine ||
                                      "No medicine information available."}
                                  </p>

                                </div>

                              </div>

                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>

                {/* INFORMATION NOTE */}

                <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#dce9e3] bg-[#f7fbf9] p-4">

                  <Info
                    size={17}
                    className="mt-0.5 shrink-0 text-[#5c8174]"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    This information is provided for
                    general awareness. For serious or
                    concerning symptoms, consult a
                    qualified veterinarian.
                  </p>

                </div>

              </div>

            )}

          </div>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <p className="mt-5 pb-2 text-center text-[11px] text-[#78958b]">

          AnimalCare

          <span className="mx-2 text-[#4c7d6d]">
            •
          </span>

          Animal Disease Detection System

        </p>

      </div>
    </main>
  );
}