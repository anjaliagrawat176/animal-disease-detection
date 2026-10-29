"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  HeartPulse,
  Loader2,
  PawPrint,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";

type Animal = {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  imageUrl: string | null;
  healthStatus: string | null;
};

type Disease = {
  id: string;
  name: string;
  description: string;
  symptoms: string;
  prevention: string;
  medicine: string;
};

type DetectionResult = {
  diseaseId: string;
  disease: string;
  confidence: number;
  observation: string;
};

export default function DiseaseDetectionPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);

  const [selectedAnimalId, setSelectedAnimalId] =
    useState("");

  const [selectedAnimal, setSelectedAnimal] =
    useState<Animal | null>(null);

  const [result, setResult] =
    useState<DetectionResult | null>(null);

  const [selectedDisease, setSelectedDisease] =
    useState<Disease | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [detecting, setDetecting] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  // =========================
  // SYMPTOMS / DESCRIPTION
  // =========================

  const [symptoms, setSymptoms] =
    useState("");

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        animalResponse,
        diseaseResponse,
      ] = await Promise.all([
        fetch("/api/animal/add", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        }),

        fetch("/api/diseasesdetails", {
          method: "GET",
          cache: "no-store",
        }),
      ]);

      const animalResult =
        await animalResponse.json();

      const diseaseResult =
        await diseaseResponse.json();

      if (
        animalResponse.ok &&
        animalResult.success
      ) {
        setAnimals(
          animalResult.data || []
        );
      } else {
        setError(
          animalResult.message ||
            "Unable to load animals."
        );
      }

      if (
        diseaseResponse.ok &&
        diseaseResult.success
      ) {
        setDiseases(
          diseaseResult.data || []
        );
      }
    } catch (error) {
      console.error(
        "Load data error:",
        error
      );

      setError(
        "Something went wrong while loading data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SELECT ANIMAL
  // =========================

  const handleAnimalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const animalId =
      e.target.value;

    setSelectedAnimalId(
      animalId
    );

    setResult(null);
    setSelectedDisease(null);
    setMessage("");
    setError("");
    setSymptoms("");

    const animal =
      animals.find(
        (item) =>
          item.id === animalId
      );

    setSelectedAnimal(
      animal || null
    );
  };

  // =========================
  // IMAGE URL
  // =========================

  const getImageUrl = (
    imageUrl: string | null
  ) => {
    if (!imageUrl) {
      return "";
    }

    return imageUrl;
  };

  // =========================
  // GET DISEASE DETAILS
  // =========================

  const findDisease = (
    diseaseId: string
  ) => {
    return (
      diseases.find(
        (disease) =>
          disease.id === diseaseId
      ) || null
    );
  };

  // =========================
  // DETECT DISEASE
  // =========================

  const handleDetectDisease =
    async () => {
      setError("");
      setMessage("");
      setResult(null);
      setSelectedDisease(null);

      if (!selectedAnimal) {
        setError(
          "Please select an animal first."
        );
        return;
      }

      if (!selectedAnimal.imageUrl) {
        setError(
          "This animal does not have a photo. Please add a photo first."
        );
        return;
      }

      try {
        setDetecting(true);

        const response =
          await fetch(
            "/api/detect",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials: "include",

              body: JSON.stringify({
                imageUrl:
                  selectedAnimal.imageUrl,

                animalId:
                  selectedAnimal.id,

                symptoms:
                  symptoms.trim(),
              }),
            }
          );

        const data =
          await response.json();

        console.log(
          "AI Detection Response:",
          data
        );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Disease detection failed."
          );
        }

        const detection =
          data.data;

        setResult(
          detection
        );

        // =========================
        // FIND DATABASE DISEASE
        // =========================

        if (detection.diseaseId) {
          const disease =
            findDisease(
              detection.diseaseId
            );

          setSelectedDisease(
            disease
          );
        }

        // =========================
        // SAVE PREDICTION
        // =========================

        if (
          detection.diseaseId &&
          detection.confidence > 0
        ) {
          await savePrediction(
            detection
          );
        } else {
          setMessage(
            "AI could not identify a disease confidently. Please provide more symptoms or try another clear image."
          );
        }
      } catch (error) {
        console.error(
          "Detection error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong during disease detection."
        );
      } finally {
        setDetecting(false);
      }
    };

  // =========================
  // SAVE PREDICTION
  // =========================

  const savePrediction = async (
    detection: DetectionResult
  ) => {
    if (
      !selectedAnimal ||
      !selectedAnimal.imageUrl ||
      !detection.diseaseId
    ) {
      return;
    }

    try {
      setSaving(true);

      const response =
        await fetch(
          "/api/predict",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              imageUrl:
                selectedAnimal.imageUrl,

              confidence:
                detection.confidence,

              animalId:
                selectedAnimal.id,

              diseaseId:
                detection.diseaseId,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "Prediction Save Response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Prediction could not be saved."
        );
      }

      setMessage(
        "Disease detected and prediction saved successfully."
      );
    } catch (error) {
      console.error(
        "Save prediction error:",
        error
      );

      setMessage(
        "Disease detected, but prediction could not be saved."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // ANIMAL ICON
  // =========================

  const getAnimalIcon = (
    type: string
  ) => {
    switch (
      type.toLowerCase()
    ) {
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

  return (
    <main className="min-h-screen bg-[#071d18] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}

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
              Secure AI Detection
            </span>

          </div>

        </div>

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-[30px] border border-[#234b40] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.25)]">

          {/* HEADER */}

          <div className="relative overflow-hidden bg-gradient-to-r from-[#103b30] via-[#185943] to-[#28775c] px-6 py-9 text-white sm:px-10 lg:px-12">

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5" />

            <div className="relative z-10 flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">

                <HeartPulse
                  size={29}
                  strokeWidth={1.8}
                />

              </div>

              <div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b8e4d1]">
                  AI Health Analysis
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Disease Detection
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d8eee4]/80">
                  Select an animal and analyze
                  its uploaded photo using AI.
                </p>

              </div>

            </div>

          </div>

          {/* CONTENT */}

          <div className="bg-white p-6 sm:p-9 lg:p-12">

            {/* SUCCESS */}

            {message && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">

                <CheckCircle2 size={19} />

                {message}

              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">

                <AlertCircle size={19} />

                {error}

              </div>
            )}

            {/* LOADING */}

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
                    Loading your animals
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Fetching your registered animals...
                  </p>

                </div>

              </div>

            ) : animals.length === 0 ? (

              /* NO ANIMALS */

              <div className="py-16 text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#e6f4ed] text-[#26755a]">

                  <PawPrint size={35} />

                </div>

                <h2 className="mt-6 text-xl font-bold text-[#203b33]">
                  No animals found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Please add an animal first
                  before starting disease detection.
                </p>

                <Link
                  href="/animal"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#17634d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#125541]"
                >
                  <PawPrint size={17} />
                  Add Animal
                </Link>

              </div>

            ) : (

              <div>

                {/* DETECTION AREA */}

                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">

                  {/* LEFT */}

                  <div>

                    <div className="mb-3">

                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                        Step 01
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-[#203b33]">
                        Select Animal
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Choose the animal you want to check.
                      </p>

                    </div>

                    {/* SELECT */}

                    <div className="relative">

                      <select
                        value={
                          selectedAnimalId
                        }
                        onChange={
                          handleAnimalChange
                        }
                        className="w-full appearance-none rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-4 py-4 pr-12 text-sm font-semibold text-[#30483f] outline-none transition focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                      >

                        <option value="">
                          Select an animal
                        </option>

                        {animals.map(
                          (animal) => (
                            <option
                              key={animal.id}
                              value={animal.id}
                            >
                              {animal.name} —{" "}
                              {animal.type}
                            </option>
                          )
                        )}

                      </select>

                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6c8c80]"
                      />

                    </div>

                    {/* ANIMAL INFO */}

                    {selectedAnimal && (
                      <div className="mt-5 rounded-2xl border border-[#d9e8e1] bg-[#f7fbf9] p-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f2ea] text-3xl">

                            {getAnimalIcon(
                              selectedAnimal.type
                            )}

                          </div>

                          <div>

                            <h3 className="font-bold text-[#203b33]">
                              {selectedAnimal.name}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">

                              {selectedAnimal.type}

                              {selectedAnimal.breed
                                ? ` • ${selectedAnimal.breed}`
                                : ""}

                            </p>

                          </div>

                        </div>

                        <div className="mt-4 border-t border-[#e3ece8] pt-4">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Photo Status
                          </p>

                          <p
                            className={`mt-1 text-xs font-semibold ${
                              selectedAnimal.imageUrl
                                ? "text-emerald-600"
                                : "text-red-500"
                            }`}
                          >
                            {selectedAnimal.imageUrl
                              ? "✓ Animal photo available"
                              : "✕ No animal photo uploaded"}
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                  {/* RIGHT */}

                  <div>

                    <div className="mb-3">

                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                        Step 02
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-[#203b33]">
                        Animal Photo
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        The selected animal photo will
                        be analyzed automatically.
                      </p>

                    </div>

                    {/* IMAGE */}

                    <div className="overflow-hidden rounded-[24px] border border-[#d8e7e0] bg-[#f4f8f6]">

                      {selectedAnimal?.imageUrl ? (

                        <div className="relative">

                          <img
                            src={getImageUrl(
                              selectedAnimal.imageUrl
                            )}
                            alt={`${selectedAnimal.name} photo`}
                            className="h-[330px] w-full object-cover sm:h-[380px]"
                          />

                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/20 bg-black/45 px-4 py-3 backdrop-blur-md">

                            <div className="flex items-center gap-2 text-white">

                              <Camera size={17} />

                              <span className="text-xs font-semibold">
                                {selectedAnimal.name}&apos;s photo
                              </span>

                            </div>

                            <span className="text-[10px] font-medium text-white/70">
                              AI Analysis Ready
                            </span>

                          </div>

                        </div>

                      ) : (

                        <div className="flex h-[330px] flex-col items-center justify-center px-6 text-center sm:h-[380px]">

                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5f2eb] text-[#28755b]">

                            <Camera size={28} />

                          </div>

                          <h3 className="mt-5 text-sm font-bold text-[#31584b]">
                            No photo available
                          </h3>

                          <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
                            Please add a photo to this
                            animal before starting detection.
                          </p>

                        </div>

                      )}

                    </div>

                    {/* SYMPTOMS / DISEASE DESCRIPTION */}

                    <div className="mt-5">

                      <label
                        htmlFor="symptoms"
                        className="mb-2 block text-sm font-bold text-[#203b33]"
                      >
                        Symptoms / Disease Description
                      </label>

                      <p className="mb-3 text-xs leading-5 text-slate-500">
                        Describe what you have noticed in
                        the animal. For example: cough,
                        loss of appetite, skin problem,
                        swelling, fever, weakness, etc.
                      </p>

                      <textarea
                        id="symptoms"
                        value={symptoms}
                        onChange={(e) =>
                          setSymptoms(
                            e.target.value
                          )
                        }
                        placeholder="Describe the animal's symptoms or suspected disease..."
                        rows={5}
                        className="w-full resize-none rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-4 py-4 text-sm text-[#30483f] outline-none transition placeholder:text-slate-400 focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                      />

                    </div>

                    {/* DETECT BUTTON */}

                    <button
                      type="button"
                      onClick={
                        handleDetectDisease
                      }
                      disabled={
                        detecting ||
                        saving ||
                        !selectedAnimal ||
                        !selectedAnimal.imageUrl
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#17634d] to-[#2b8063] px-6 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(23,99,77,0.20)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {detecting ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />

                          AI Analyzing...
                        </>
                      ) : saving ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />

                          Saving Result...
                        </>
                      ) : (
                        <>
                          <Sparkles size={19} />

                          Detect Disease
                        </>
                      )}

                    </button>

                  </div>

                </div>

                {/* RESULT */}

                {result && (
                  <div className="mt-10 border-t border-[#e2ebe7] pt-8">

                    <div className="mb-5">

                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                        Detection Result
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-[#203b33]">
                        AI Disease Analysis
                      </h2>

                    </div>

                    {/* UNKNOWN */}

                    {!result.diseaseId ? (

                      <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-6">

                        <div className="flex items-start gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">

                            <Info size={23} />

                          </div>

                          <div>

                            <h3 className="text-lg font-bold text-amber-800">
                              Disease could not be identified
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-amber-700">
                              The image and symptoms did not
                              provide enough evidence for a
                              confident result. Please provide
                              more details or try a clearer image.
                            </p>

                          </div>

                        </div>

                      </div>

                    ) : (

                      <div className="rounded-[24px] border border-[#cfe4d8] bg-gradient-to-br from-[#f0faf5] to-white p-6">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                          <div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-[#dff3e8] px-3 py-1.5 text-xs font-bold text-[#28755b]">

                              <HeartPulse size={14} />

                              AI Detected Disease

                            </div>

                            <h3 className="mt-4 text-2xl font-bold text-[#203b33]">
                              {result.disease}
                            </h3>

                            {result.observation && (
                              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                {result.observation}
                              </p>
                            )}

                          </div>

                          <div className="shrink-0 rounded-2xl border border-[#cfe4d8] bg-white px-5 py-4 text-center">

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              AI Confidence
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#28755b]">
                              {Number(
                                result.confidence
                              ).toFixed(0)}
                              %
                            </p>

                          </div>

                        </div>

                        {/* DATABASE DETAILS */}

                        {selectedDisease && (
                          <div className="mt-7 grid gap-4 md:grid-cols-3">

                            <div className="rounded-2xl border border-[#e0ebe5] bg-white p-4">

                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#28755b]">
                                Symptoms
                              </h4>

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {selectedDisease.symptoms}
                              </p>

                            </div>

                            <div className="rounded-2xl border border-[#e0ebe5] bg-white p-4">

                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#28755b]">
                                Prevention
                              </h4>

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {selectedDisease.prevention}
                              </p>

                            </div>

                            <div className="rounded-2xl border border-[#e0ebe5] bg-white p-4">

                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#28755b]">
                                Medicine
                              </h4>

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {selectedDisease.medicine}
                              </p>

                            </div>

                          </div>
                        )}

                      </div>

                    )}

                    {/* DISCLAIMER */}

                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                      <Info
                        size={17}
                        className="mt-0.5 shrink-0 text-slate-500"
                      />

                      <p className="text-xs leading-5 text-slate-500">
                        This AI result is a preliminary
                        screening and should not be treated
                        as a confirmed veterinary diagnosis.
                        For concerning symptoms, consult a
                        qualified veterinarian.
                      </p>

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        </div>

        {/* FOOTER */}

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