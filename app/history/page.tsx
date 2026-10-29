"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Loader2,
  PawPrint,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

type Animal = {
  id: string;
  name: string;
  type: string;
  breed?: string | null;
};

type Disease = {
  id: string;
  name: string;
  description?: string;
  symptoms?: string;
  prevention?: string;
  medicine?: string;
};

type Prediction = {
  id: string;
  imageUrl: string;
  confidence: number;
  status: string;
  createdAt: string;
  animal: Animal;
  disease: Disease;
};

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD HISTORY
  ========================= */

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/history", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load prediction history."
          );
        }

        setPredictions(data.data || []);
      } catch (error) {
        console.error("History loading error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load prediction history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  /* =========================
     DATE FORMAT
  ========================= */

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="min-h-screen bg-[#eef8f4] text-slate-800">

      {/* =========================
          HEADER
      ========================= */}

      <header className="sticky top-0 z-30 border-b border-[#d8ebe6] bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between px-5">

          <div className="flex items-center gap-3">

            <Link
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8ebe6] text-[#28766c] transition hover:bg-[#eef8f4]"
            >
              <ArrowLeft size={17} />
            </Link>

            <div>

              <h1 className="text-lg font-bold text-[#173b39]">
                Prediction History
              </h1>

              <p className="text-[10px] text-slate-400">
                Your previous animal disease detections
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 rounded-lg bg-[#e0f4ef] px-3 py-2 text-[10px] font-bold text-[#28766c]">
            <ShieldCheck size={14} />
            AI Health System
          </div>

        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="mx-auto max-w-6xl px-5 py-7">

        {/* INTRO */}

        <section className="mb-6 rounded-2xl bg-[#245c56] p-6 text-white shadow-md">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#78d6c4] text-[#123c3a]">
              <Activity size={22} />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Disease Detection History
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-[#d0e5e1]">
                View your previous AI disease detection results,
                affected animals and prediction details.
              </p>

            </div>

          </div>

        </section>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">

            <AlertCircle size={17} />

            {error}

          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#d8ebe6] bg-white shadow-sm">

            <Loader2
              size={30}
              className="animate-spin text-[#28766c]"
            />

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading prediction history...
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Please wait
            </p>

          </div>

        ) : predictions.length === 0 ? (

          /* =========================
             EMPTY STATE
          ========================= */

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#d8ebe6] bg-white p-8 text-center shadow-sm">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef8f4] text-[#28766c]">

              <Stethoscope size={28} />

            </div>

            <h3 className="mt-5 text-base font-bold text-slate-700">
              No Prediction History
            </h3>

            <p className="mt-2 max-w-sm text-[10px] leading-5 text-slate-400">
              You have not saved any disease predictions yet.
              Perform a disease detection and save the prediction
              to see it here.
            </p>

            <Link
              href="/prediction"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#245c56] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#194943]"
            >
              <Stethoscope size={15} />
              Detect Disease
            </Link>

          </div>

        ) : (

          /* =========================
             HISTORY LIST
          ========================= */

          <div>

            {/* SUMMARY */}

            <div className="mb-5 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-[#d8ebe6] bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e0f4ef] text-[#28766c]">
                    <Activity size={18} />
                  </div>

                  <div>

                    <p className="text-[10px] text-slate-400">
                      Total Predictions
                    </p>

                    <p className="text-xl font-bold text-[#173b39]">
                      {predictions.length}
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-xl border border-[#d8ebe6] bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e0f4ef] text-[#28766c]">
                    <PawPrint size={18} />
                  </div>

                  <div>

                    <p className="text-[10px] text-slate-400">
                      Animals Checked
                    </p>

                    <p className="text-xl font-bold text-[#173b39]">
                      {
                        new Set(
                          predictions.map(
                            (prediction) => prediction.animal?.id
                          )
                        ).size
                      }
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-xl border border-[#d8ebe6] bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e0f4ef] text-[#28766c]">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>

                    <p className="text-[10px] text-slate-400">
                      Saved Results
                    </p>

                    <p className="text-xl font-bold text-[#173b39]">
                      {predictions.length}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* CARDS */}

            <div className="space-y-4">

              {predictions.map((prediction) => (

                <div
                  key={prediction.id}
                  className="overflow-hidden rounded-2xl border border-[#d8ebe6] bg-white shadow-sm"
                >

                  <div className="p-5">

                    <div className="flex flex-col gap-5 lg:flex-row">

                      {/* IMAGE */}

                      <div className="shrink-0">

                        <div className="h-32 w-full overflow-hidden rounded-xl bg-[#eef8f4] sm:w-40">

                          {prediction.imageUrl ? (

                            <img
                              src={prediction.imageUrl}
                              alt={
                                prediction.animal?.name ||
                                "Animal"
                              }
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <div className="flex h-full w-full items-center justify-center text-[#28766c]">

                              <PawPrint size={35} />

                            </div>

                          )}

                        </div>

                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col justify-between gap-3 sm:flex-row">

                          <div>

                            <p className="text-[9px] font-bold uppercase tracking-wider text-[#28766c]">
                              Detected Disease
                            </p>

                            <h3 className="mt-1 text-lg font-bold text-[#173b39]">
                              {prediction.disease?.name ||
                                "Unknown Disease"}
                            </h3>

                          </div>

                          <span className="w-fit rounded-full bg-[#e0f4ef] px-3 py-1.5 text-[9px] font-bold text-[#28766c]">
                            {prediction.status ||
                              "Pending"}
                          </span>

                        </div>

                        {/* INFO */}

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">

                          <div className="rounded-lg bg-[#f7fbfa] p-3">

                            <div className="flex items-center gap-2">

                              <PawPrint
                                size={14}
                                className="text-[#28766c]"
                              />

                              <span className="text-[9px] font-semibold text-slate-400">
                                Animal
                              </span>

                            </div>

                            <p className="mt-1 text-xs font-bold text-slate-700">
                              {prediction.animal?.name ||
                                "Unknown"}
                            </p>

                            <p className="text-[9px] text-slate-400">
                              {prediction.animal?.type ||
                                ""}
                            </p>

                          </div>

                          <div className="rounded-lg bg-[#f7fbfa] p-3">

                            <div className="flex items-center gap-2">

                              <Activity
                                size={14}
                                className="text-[#28766c]"
                              />

                              <span className="text-[9px] font-semibold text-slate-400">
                                Confidence
                              </span>

                            </div>

                            <p className="mt-1 text-xs font-bold text-slate-700">
                              {Number(
                                prediction.confidence
                              ).toFixed(0)}
                              %
                            </p>

                          </div>

                          <div className="rounded-lg bg-[#f7fbfa] p-3">

                            <div className="flex items-center gap-2">

                              <CalendarDays
                                size={14}
                                className="text-[#28766c]"
                              />

                              <span className="text-[9px] font-semibold text-slate-400">
                                Date
                              </span>

                            </div>

                            <p className="mt-1 text-[10px] font-bold text-slate-700">
                              {formatDate(
                                prediction.createdAt
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="border-t border-[#edf4f2] bg-[#f9fcfb] px-5 py-3">

                    <div className="flex flex-col gap-2 text-[9px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                      <span>
                        Prediction ID: {prediction.id}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <CheckCircle2
                          size={12}
                          className="text-[#28766c]"
                        />
                        Prediction saved successfully
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </main>

    </div>
  );
}