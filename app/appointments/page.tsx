"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  PawPrint,
  Stethoscope,
  UserRound,
  XCircle,
  ShieldCheck,
} from "lucide-react";

type Animal = {
  id: string;
  name: string;
  type: string;
  breed: string | null;
};

type Appointment = {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string | null;
  status: string;
  animal: {
    id: string;
    name: string;
    type: string;
  };
};

type Doctor = {
  name: string;
  specialization: string;
  experience: string;
};

const doctors: Doctor[] = [
  {
    name: "Dr. Rajesh Sharma",
    specialization: "Veterinary Physician",
    experience: "10+ years experience",
  },
  {
    name: "Dr. Priya Verma",
    specialization: "Animal Health Specialist",
    experience: "8+ years experience",
  },
  {
    name: "Dr. Amit Kumar",
    specialization: "Veterinary Surgeon",
    experience: "12+ years experience",
  },
  {
    name: "Dr. Neha Singh",
    specialization: "Pet & Livestock Specialist",
    experience: "7+ years experience",
  },
];

export default function AppointmentsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD ANIMALS + APPOINTMENTS
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [animalResponse, appointmentResponse] =
        await Promise.all([
          fetch("/api/animal/add", {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          }),

          fetch("/api/appointments", {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          }),
        ]);

      const animalResult = await animalResponse.json();
      const appointmentResult =
        await appointmentResponse.json();

      // -------------------------------
      // ANIMALS
      // -------------------------------

      if (
        animalResponse.ok &&
        animalResult.success
      ) {
        setAnimals(animalResult.data || []);
      } else {
        setError(
          animalResult.message ||
            "Unable to load animals."
        );
      }

      // -------------------------------
      // APPOINTMENTS
      // -------------------------------

      if (
        appointmentResponse.ok &&
        appointmentResult.success
      ) {
        setAppointments(
          appointmentResult.data || []
        );
      } else if (
        appointmentResponse.status !== 401
      ) {
        console.error(
          "Appointment API Error:",
          appointmentResult
        );
      }
    } catch (error) {
      console.error(
        "Load appointment data error:",
        error
      );

      setError(
        "Something went wrong while loading data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleBookAppointment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (!selectedAnimalId) {
      setError("Please select an animal.");
      return;
    }

    if (!doctorName) {
      setError("Please select a veterinarian.");
      return;
    }

    if (!date) {
      setError("Please select an appointment date.");
      return;
    }

    if (!time) {
      setError("Please select an appointment time.");
      return;
    }

    try {
      setBooking(true);

      const response = await fetch(
        "/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",

          body: JSON.stringify({
            animalId: selectedAnimalId,
            doctorName,
            date,
            time,
            reason: reason.trim() || null,
          }),
        }
      );

      const result = await response.json();

      console.log(
        "Appointment Response:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to book appointment."
        );
      }

      setSuccess(
        "Appointment booked successfully!"
      );

      // -------------------------------
      // CLEAR FORM
      // -------------------------------

      setSelectedAnimalId("");
      setDoctorName("");
      setDate("");
      setTime("");
      setReason("");

      // -------------------------------
      // REFRESH APPOINTMENTS
      // -------------------------------

      await loadData();
    } catch (error) {
      console.error(
        "Book appointment error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to book appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    dateString: string
  ) => {
    try {
      return new Date(
        dateString
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // =====================================================
  // GET STATUS STYLE
  // =====================================================

  const getStatusStyle = (
    status: string
  ) => {
    switch (
      status.toLowerCase()
    ) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-600";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="mb-6 flex items-center justify-between">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#31584b] transition hover:bg-white"
          >
            <ArrowLeft size={18} />

            Dashboard
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-[#d8e8e0] bg-white px-4 py-2 sm:flex">

            <Stethoscope
              size={16}
              className="text-[#28755b]"
            />

            <span className="text-xs font-semibold text-[#537568]">
              Veterinary Care
            </span>

          </div>

        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div className="overflow-hidden rounded-[30px] border border-[#d9e7e1] bg-white shadow-[0_20px_60px_rgba(25,70,55,0.08)]">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="relative overflow-hidden bg-gradient-to-r from-[#103b30] via-[#185943] to-[#28775c] px-6 py-9 text-white sm:px-10 lg:px-12">

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5" />

            <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-white/[0.03]" />

            <div className="relative z-10 flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">

                <CalendarDays
                  size={29}
                  strokeWidth={1.8}
                />

              </div>

              <div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b8e4d1]">
                  Veterinary Care
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Appointments
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d8eee4]/80">
                  Schedule a veterinary consultation
                  for your animal with ease.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="p-6 sm:p-9 lg:p-12">

            {/* SUCCESS */}

            {success && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">

                <CheckCircle2
                  size={19}
                />

                {success}

              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">

                <XCircle
                  size={19}
                />

                {error}

              </div>
            )}

            {loading ? (

              /* =================================================
                  LOADING
              ================================================= */

              <div className="flex min-h-[400px] items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f4ed] text-[#23765a]">

                    <Loader2
                      size={28}
                      className="animate-spin"
                    />

                  </div>

                  <h2 className="mt-5 text-sm font-bold text-[#294d40]">
                    Loading appointments
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Fetching your appointment data...
                  </p>

                </div>

              </div>

            ) : (

              <>

                {/* =================================================
                    BOOK APPOINTMENT
                ================================================= */}

                <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">

                  {/* LEFT FORM */}

                  <div>

                    <div className="mb-6">

                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                        New Appointment
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-[#203b33]">
                        Book a Veterinary Visit
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        Select your animal, veterinarian
                        and preferred schedule.
                      </p>

                    </div>

                    <form
                      onSubmit={
                        handleBookAppointment
                      }
                      className="space-y-5"
                    >

                      {/* ANIMAL */}

                      <div>

                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#537568]">
                          Select Animal
                        </label>

                        <div className="relative">

                          <PawPrint
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6c8c80]"
                          />

                          <select
                            value={
                              selectedAnimalId
                            }
                            onChange={(e) =>
                              setSelectedAnimalId(
                                e.target.value
                              )
                            }
                            className="w-full appearance-none rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-11 py-4 pr-12 text-sm font-semibold text-[#30483f] outline-none transition focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                          >

                            <option value="">
                              Select your animal
                            </option>

                            {animals.map(
                              (animal) => (
                                <option
                                  key={
                                    animal.id
                                  }
                                  value={
                                    animal.id
                                  }
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

                      </div>

                      {/* DOCTOR */}

                      <div>

                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#537568]">
                          Veterinarian
                        </label>

                        <div className="relative">

                          <Stethoscope
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6c8c80]"
                          />

                          <select
                            value={
                              doctorName
                            }
                            onChange={(e) =>
                              setDoctorName(
                                e.target.value
                              )
                            }
                            className="w-full appearance-none rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-11 py-4 pr-12 text-sm font-semibold text-[#30483f] outline-none transition focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                          >

                            <option value="">
                              Select veterinarian
                            </option>

                            {doctors.map(
                              (doctor) => (
                                <option
                                  key={
                                    doctor.name
                                  }
                                  value={
                                    doctor.name
                                  }
                                >
                                  {doctor.name} —{" "}
                                  {
                                    doctor.specialization
                                  }
                                </option>
                              )
                            )}

                          </select>

                          <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6c8c80]"
                          />

                        </div>

                      </div>

                      {/* DATE + TIME */}

                      <div className="grid gap-5 sm:grid-cols-2">

                        <div>

                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#537568]">
                            Appointment Date
                          </label>

                          <div className="relative">

                            <CalendarDays
                              size={18}
                              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6c8c80]"
                            />

                            <input
                              type="date"
                              value={date}
                              min={
                                new Date()
                                  .toISOString()
                                  .split("T")[0]
                              }
                              onChange={(e) =>
                                setDate(
                                  e.target.value
                                )
                              }
                              className="w-full rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-11 py-4 text-sm font-semibold text-[#30483f] outline-none transition focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                            />

                          </div>

                        </div>

                        <div>

                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#537568]">
                            Preferred Time
                          </label>

                          <div className="relative">

                            <Clock3
                              size={18}
                              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6c8c80]"
                            />

                            <input
                              type="time"
                              value={time}
                              onChange={(e) =>
                                setTime(
                                  e.target.value
                                )
                              }
                              className="w-full rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-11 py-4 text-sm font-semibold text-[#30483f] outline-none transition focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                            />

                          </div>

                        </div>

                      </div>

                      {/* REASON */}

                      <div>

                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#537568]">
                          Reason / Concern
                        </label>

                        <textarea
                          value={reason}
                          onChange={(e) =>
                            setReason(
                              e.target.value
                            )
                          }
                          rows={4}
                          placeholder="Describe your animal's health concern..."
                          className="w-full resize-none rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-4 py-4 text-sm text-[#30483f] outline-none transition placeholder:text-slate-400 focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                        />

                      </div>

                      {/* BUTTON */}

                      <button
                        type="submit"
                        disabled={booking}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#17634d] to-[#2b8063] px-6 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(23,99,77,0.20)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(23,99,77,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        {booking ? (
                          <>
                            <Loader2
                              size={19}
                              className="animate-spin"
                            />

                            Booking Appointment...
                          </>
                        ) : (
                          <>
                            <CalendarDays
                              size={19}
                            />

                            Book Appointment
                          </>
                        )}

                      </button>

                    </form>

                  </div>

                  {/* RIGHT - DOCTORS */}

                  <div>

                    <div className="mb-5">

                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                        Veterinary Team
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-[#203b33]">
                        Available Veterinarians
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Choose a veterinarian according
                        to your animal's needs.
                      </p>

                    </div>

                    <div className="space-y-3">

                      {doctors.map(
                        (doctor) => (
                          <button
                            key={
                              doctor.name
                            }
                            type="button"
                            onClick={() =>
                              setDoctorName(
                                doctor.name
                              )
                            }
                            className={`w-full rounded-2xl border p-4 text-left transition ${
                              doctorName ===
                              doctor.name
                                ? "border-[#2b8063] bg-[#eef8f3] shadow-sm"
                                : "border-[#e0ebe5] bg-[#f9fbfa] hover:border-[#b9d8ca] hover:bg-white"
                            }`}
                          >

                            <div className="flex items-center gap-4">

                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#dff1e7] text-[#28755b]">

                                <UserRound
                                  size={22}
                                />

                              </div>

                              <div className="min-w-0">

                                <div className="flex items-center gap-2">

                                  <h3 className="truncate text-sm font-bold text-[#294d40]">
                                    {
                                      doctor.name
                                    }
                                  </h3>

                                  {doctorName ===
                                    doctor.name && (
                                    <CheckCircle2
                                      size={
                                        16
                                      }
                                      className="shrink-0 text-[#28755b]"
                                    />
                                  )}

                                </div>

                                <p className="mt-1 text-xs font-medium text-[#668479]">
                                  {
                                    doctor.specialization
                                  }
                                </p>

                                <p className="mt-1 text-[11px] text-slate-400">
                                  {
                                    doctor.experience
                                  }
                                </p>

                              </div>

                            </div>

                          </button>
                        )
                      )}

                    </div>

                    {/* INFO CARD */}

                    <div className="mt-5 rounded-2xl border border-[#dceae3] bg-[#f2f8f5] p-5">

                      <div className="flex items-start gap-3">

                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#28755b] shadow-sm">

                          <ShieldCheck
                            size={18} 
                          />

                        </div>

                        <div>

                          <h3 className="text-sm font-bold text-[#31584b]">
                            Veterinary Consultation
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Your appointment request
                            will be recorded in your
                            account for easy tracking.
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    EXISTING APPOINTMENTS
                ================================================= */}

                <div className="mt-12 border-t border-[#e2ebe7] pt-9">

                  <div className="mb-5">

                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                      Appointment History
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-[#203b33]">
                      My Appointments
                    </h2>

                  </div>

                  {appointments.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-[#cfded7] bg-[#f9fbfa] px-6 py-10 text-center">

                      <CalendarDays
                        size={32}
                        className="mx-auto text-[#8aa99c]"
                      />

                      <h3 className="mt-4 text-sm font-bold text-[#31584b]">
                        No appointments yet
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Your booked appointments
                        will appear here.
                      </p>

                    </div>

                  ) : (

                    <div className="grid gap-4 md:grid-cols-2">

                      {appointments.map(
                        (appointment) => (
                          <div
                            key={
                              appointment.id
                            }
                            className="rounded-2xl border border-[#dce9e3] bg-[#fbfdfc] p-5 transition hover:border-[#b9d8ca] hover:shadow-sm"
                          >

                            <div className="flex items-start justify-between gap-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f3eb] text-[#28755b]">

                                  <Stethoscope
                                    size={20}
                                  />

                                </div>

                                <div>

                                  <h3 className="text-sm font-bold text-[#294d40]">
                                    {
                                      appointment.doctorName
                                    }
                                  </h3>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {
                                      appointment.animal
                                        ?.name
                                    }{" "}
                                    •{" "}
                                    {
                                      appointment.animal
                                        ?.type
                                    }
                                  </p>

                                </div>

                              </div>

                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-bold ${getStatusStyle(
                                  appointment.status
                                )}`}
                              >
                                {
                                  appointment.status
                                }
                              </span>

                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">

                              <div className="rounded-xl bg-[#f2f7f4] p-3">

                                <div className="flex items-center gap-2">

                                  <CalendarDays
                                    size={15}
                                    className="text-[#28755b]"
                                  />

                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Date
                                  </span>

                                </div>

                                <p className="mt-1 text-xs font-bold text-[#31584b]">
                                  {formatDate(
                                    appointment.date
                                  )}
                                </p>

                              </div>

                              <div className="rounded-xl bg-[#f2f7f4] p-3">

                                <div className="flex items-center gap-2">

                                  <Clock3
                                    size={15}
                                    className="text-[#28755b]"
                                  />

                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Time
                                  </span>

                                </div>

                                <p className="mt-1 text-xs font-bold text-[#31584b]">
                                  {
                                    appointment.time
                                  }
                                </p>

                              </div>

                            </div>

                            {appointment.reason && (
                              <div className="mt-3 rounded-xl border border-[#e4ece8] bg-white p-3">

                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Reason
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                  {
                                    appointment.reason
                                  }
                                </p>

                              </div>
                            )}

                          </div>
                        )
                      )}

                    </div>

                  )}

                </div>

              </>

            )}

          </div>
        </div>

        {/* FOOTER */}

        <p className="mt-5 pb-2 text-center text-[11px] text-[#78958b]">

          AnimalCare

          <span className="mx-2 text-[#4c7d6d]">
            •
          </span>

          Veterinary Appointment System

        </p>

      </div>
    </main>
  );
}