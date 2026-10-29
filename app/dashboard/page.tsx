"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Activity,
  AlertCircle,
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  Home,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  Upload,
  User,
  Database,
  Microscope,
  CheckCircle2,
  Moon,
  Sun,
  Languages,
  Settings,
  LogOut,
  Clock3,
} from "lucide-react";

import { useThemeLanguage } from "@/components/ThemeLanguageProvider";

type Animal = {
  id: string;
  name: string;
  type: string;
  breed?: string | null;
  age?: number | null;
  gender?: string | null;
  healthStatus?: string | null;
  createdAt: string;
};

type Prediction = {
  id: string;
  confidence: number;
  status: string;
  createdAt: string;
  animal?: {
    name: string;
    type: string;
  };
  disease?: {
    name: string;
  };
};

type Appointment = {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string | null;
  status: string;
  animal?: {
    id: string;
    name: string;
    type: string;
    breed?: string | null;
  };
};

type DashboardData = {
  totalAnimals: number;
  totalPredictions: number;
  totalDiseases: number;
  healthyAnimals: number;
  healthAlerts: number;
  averageConfidence: number;
  recentAnimals: Animal[];
  recentPredictions: Prediction[];
};

type ProfileData = {
  id: string;
  name: string;
  email: string;
  phoneno: string;
};

export default function DashboardPage() {
  const {
    theme,
    language,
    toggleTheme,
    setLanguage,
  } = useThemeLanguage();

  const [data, setData] =
    useState<DashboardData>({
      totalAnimals: 0,
      totalPredictions: 0,
      totalDiseases: 0,
      healthyAnimals: 0,
      healthAlerts: 0,
      averageConfidence: 0,
      recentAnimals: [],
      recentPredictions: [],
    });

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [logoutConfirmOpen, setLogoutConfirmOpen] =
    useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        // =========================
        // DASHBOARD DATA
        // =========================

        const dashboardResponse =
          await fetch("/api/dashboard", {
            cache: "no-store",
          });

        const dashboardResult =
          await dashboardResponse.json();

        if (dashboardResult.success) {
          setData(dashboardResult.data);
        }

        // =========================
        // PROFILE DATA
        // =========================

        const profileResponse =
          await fetch("/api/profile", {
            cache: "no-store",
          });

        const profileResult =
          await profileResponse.json();

        if (profileResult.success) {
          setProfile(
            profileResult.data
          );
        }

        // =========================
        // APPOINTMENT DATA
        // =========================

        const appointmentResponse =
          await fetch("/api/appointments", {
            cache: "no-store",
            credentials: "include",
          });

        const appointmentResult =
          await appointmentResponse.json();

        if (
          appointmentResponse.ok &&
          appointmentResult.success
        ) {
          setAppointments(
            appointmentResult.data || []
          );
        } else if (
          appointmentResponse.status !==
          401
        ) {
          console.error(
            "Appointment loading error:",
            appointmentResult
          );
        }
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result =
        await response.json();

      if (result.success) {
        window.location.href =
          "/login";
      } else {
        alert(
          result.message ||
            "Logout failed"
        );
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      alert("Unable to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  const isHindi =
    language === "hi";

  const userName =
    profile?.name || "User";

  const userInitial =
    userName
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#dcebe7] text-slate-800 transition-colors duration-300 dark:bg-[#091c1b] dark:text-[#e5f4f1]">

      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-[#123c3a] text-white shadow-xl lg:block">

        <div className="flex h-full flex-col">

          {/* LOGO */}

          <div className="border-b border-white/10 px-5 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#66c7b5] text-[#123c3a]">
                <PawPrint size={21} />
              </div>

              <div>

                <h1 className="text-base font-bold">
                  AnimalCare
                </h1>

                <p className="text-[10px] text-[#b7d8d2]">
                  {isHindi
                    ? "पशु रोग पहचान"
                    : "Disease Detection"}
                </p>

              </div>

            </div>

          </div>

          {/* MENU */}

          <div className="flex-1 overflow-y-auto px-3 py-5">

            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8db5ae]">
              {isHindi
                ? "मुख्य मेनू"
                : "Main Menu"}
            </p>

            <nav className="space-y-1">

              <MenuItem
                href="/dashboard"
                icon={<Home size={18} />}
                title={
                  isHindi
                    ? "डैशबोर्ड"
                    : "Dashboard"
                }
                active
              />

              <MenuItem
                href="/animal/list"
                icon={<PawPrint size={18} />}
                title={
                  isHindi
                    ? "मेरे पशु"
                    : "My Animals"
                }
              />

              <MenuItem
                href="/prediction"
                icon={<Activity size={18} />}
                title={
                  isHindi
                    ? "रोग पहचान"
                    : "Disease Detection"
                }
              />

              <MenuItem
                href="/history"
                icon={
                  <ClipboardList
                    size={18}
                  />
                }
                title={
                  isHindi
                    ? "रोग इतिहास"
                    : "Prediction History"
                }
              />

              <MenuItem
                href="/diseases"
                icon={
                  <HeartPulse
                    size={18}
                  />
                }
                title={
                  isHindi
                    ? "रोग जानकारी"
                    : "Disease Information"
                }
              />

              <MenuItem
                href="/appointments"
                icon={
                  <CalendarDays
                    size={18}
                  />
                }
                title={
                  isHindi
                    ? "अपॉइंटमेंट"
                    : "Appointments"
                }
              />

            </nav>

            <p className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8db5ae]">
              {isHindi
                ? "सहायता"
                : "Support"}
            </p>

            <nav className="space-y-1">

              <MenuItem
                href="/profile"
                icon={<User size={18} />}
                title={
                  isHindi
                    ? "मेरी प्रोफ़ाइल"
                    : "My Profile"
                }
              />

              <MenuItem
                href="/settings"
                icon={
                  <Settings size={18} />
                }
                title={
                  isHindi
                    ? "सेटिंग्स"
                    : "Settings"
                }
              />

              {/* LOGOUT */}

              <button
                type="button"
                onClick={() =>
                  setLogoutConfirmOpen(
                    true
                  )
                }
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#c0d9d5] transition hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
              >

                <LogOut size={18} />

                {loggingOut
                  ? "Logging out..."
                  : isHindi
                    ? "लॉग आउट"
                    : "Logout"}

              </button>

            </nav>

          </div>

          {/* BOTTOM CARD */}

          <div className="border-t border-white/10 p-3">

            <div className="rounded-xl bg-[#0d302e] p-4">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#66c7b5]/15 text-[#78d6c4]">
                <ShieldCheck
                  size={18}
                />
              </div>

              <h3 className="text-xs font-bold">
                {isHindi
                  ? "स्मार्ट पशु देखभाल"
                  : "Smart Animal Care"}
              </h3>

              <p className="mt-1 text-[10px] leading-4 text-[#a9c9c4]">
                {isHindi
                  ? "अपने पशुओं की निगरानी करें और संभावित रोगों का जल्दी पता लगाएं।"
                  : "Monitor your animals and detect possible diseases early."}
              </p>

              <Link
                href="/prediction"
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#76d4c2]"
              >
                {isHindi
                  ? "रोग पहचान शुरू करें"
                  : "Start Detection"}

                <ChevronRight
                  size={13}
                />
              </Link>

            </div>

          </div>

        </div>

      </aside>

      {/* ===================================================== */}
      {/* MAIN */}
      {/* ===================================================== */}

      <main className="lg:ml-64">

        {/* HEADER */}

        <header className="sticky top-0 z-30 border-b border-[#c7ded9] bg-white/95 backdrop-blur dark:border-[#214441] dark:bg-[#102725]/95">

          <div className="flex h-[70px] items-center justify-between px-5 sm:px-7">

            {/* TITLE */}

            <div>

              <p className="text-[11px] font-medium text-slate-500 dark:text-[#9bb7b3]">
                {isHindi
                  ? `वापसी पर स्वागत है, ${userName} 👋`
                  : `Welcome back, ${userName} 👋`}
              </p>

              <h2 className="text-xl font-bold text-[#173b39] dark:text-[#e5f4f1]">
                {isHindi
                  ? "डैशबोर्ड"
                  : "Dashboard"}
              </h2>

            </div>

            {/* HEADER ACTIONS */}

            <div className="flex items-center gap-2">

              {/* LANGUAGE */}

              <div className="relative">

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(
                      e.target.value as
                        | "en"
                        | "hi"
                    )
                  }
                  className="h-9 cursor-pointer appearance-none rounded-lg border border-[#dcebe7] bg-white pl-8 pr-7 text-[11px] font-bold text-slate-600 outline-none hover:bg-[#eef8f4] dark:border-[#315b56] dark:bg-[#173532] dark:text-[#d3e8e4]"
                  aria-label="Select language"
                >
                  <option value="en">
                    EN
                  </option>

                  <option value="hi">
                    हि
                  </option>
                </select>

                <Languages
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#28766c]"
                />

              </div>

              {/* THEME */}

              <button
                type="button"
                onClick={toggleTheme}
                title={
                  theme ===
                  "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dcebe7] bg-white text-slate-500 hover:bg-[#eef8f4] dark:border-[#315b56] dark:bg-[#173532] dark:text-[#d3e8e4]"
              >
                {theme ===
                "light" ? (
                  <Moon
                    size={17}
                  />
                ) : (
                  <Sun
                    size={17}
                  />
                )}
              </button>

              {/* NOTIFICATION */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setNotificationOpen(
                      !notificationOpen
                    )
                  }
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#dcebe7] bg-white text-slate-500 hover:bg-[#eef8f4] dark:border-[#315b56] dark:bg-[#173532] dark:text-[#b7d0cc]"
                >

                  <Bell size={17} />

                  {data.healthAlerts >
                    0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
                      {
                        data.healthAlerts
                      }
                    </span>
                  )}

                </button>

                {notificationOpen && (

                  <div className="absolute right-0 top-11 w-72 rounded-xl border border-[#d8ebe6] bg-white p-4 shadow-xl dark:border-[#315b56] dark:bg-[#163331]">

                    <div className="flex items-center justify-between">

                      <h3 className="text-xs font-bold text-slate-700 dark:text-[#d3e8e4]">
                        {isHindi
                          ? "सूचनाएं"
                          : "Notifications"}
                      </h3>

                      <Bell
                        size={15}
                        className="text-[#28766c]"
                      />

                    </div>

                    {data.healthAlerts >
                    0 ? (

                      <div className="mt-3 rounded-lg bg-[#fff3e2] p-3">

                        <div className="flex gap-2">

                          <AlertCircle
                            size={16}
                            className="shrink-0 text-[#c47b20]"
                          />

                          <div>

                            <p className="text-[10px] font-bold text-[#ad6c1c]">
                              {isHindi
                                ? "स्वास्थ्य चेतावनी"
                                : "Health Alert"}
                            </p>

                            <p className="mt-1 text-[9px] text-[#9d7a49]">
                              {
                                data.healthAlerts
                              }{" "}
                              {isHindi
                                ? "पशु ध्यान देने योग्य हैं।"
                                : "animal(s) may need attention."}
                            </p>

                          </div>

                        </div>

                      </div>

                    ) : (

                      <div className="mt-3 rounded-lg bg-[#eef8f4] p-3">

                        <div className="flex items-center gap-2">

                          <CheckCircle2
                            size={16}
                            className="text-[#31855a]"
                          />

                          <p className="text-[10px] font-semibold text-[#31855a]">
                            {isHindi
                              ? "कोई नई चेतावनी नहीं"
                              : "No new alerts"}
                          </p>

                        </div>

                      </div>

                    )}

                  </div>

                )}

              </div>

              {/* USER PROFILE */}

              <Link
                href="/profile"
                className="flex items-center gap-2 border-l border-slate-200 pl-3 transition hover:opacity-80 dark:border-[#315650]"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9f1eb] text-xs font-bold text-[#23655d]">
                  {userInitial}
                </div>

                <div className="hidden sm:block">

                  <p className="max-w-[100px] truncate text-xs font-bold text-slate-700 dark:text-[#d3e8e4]">
                    {userName}
                  </p>

                  <p className="text-[10px] text-slate-400 dark:text-[#819f9a]">
                    {isHindi
                      ? "पशु मालिक"
                      : "Animal Owner"}
                  </p>

                </div>

              </Link>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="mx-auto max-w-[1400px] p-5 sm:p-7">

          {/* HERO */}

          <section className="relative overflow-hidden rounded-2xl bg-[#245c56] px-6 py-7 text-white shadow-md sm:px-8">

            <div className="relative z-10 max-w-xl">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold text-[#bcebe2]">

                <Activity size={13} />

                {isHindi
                  ? "AI पशु स्वास्थ्य निगरानी"
                  : "AI ANIMAL HEALTH MONITORING"}

              </div>

              <h1 className="text-2xl font-bold sm:text-[28px]">
                {isHindi
                  ? "अपने पशुओं की बेहतर देखभाल करें"
                  : "Take better care of your animals"}
              </h1>

              <p className="mt-2.5 max-w-lg text-xs leading-5 text-[#d0e5e1]">
                {isHindi
                  ? "अपने पशुओं की निगरानी करें, तस्वीरें अपलोड करें और AI आधारित रोग पहचान से उनके स्वास्थ्य की जानकारी प्राप्त करें।"
                  : "Monitor your animals, upload images and use AI-powered disease detection to understand their health condition."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">

                <Link
                  href="/prediction"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#78d6c4] px-4 py-2.5 text-xs font-bold text-[#123c3a] transition hover:bg-[#92e1d2]"
                >
                  <Upload size={15} />

                  {isHindi
                    ? "रोग पहचान"
                    : "Detect Disease"}
                </Link>

                <Link
                  href="/animal/list"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
                >
                  <PawPrint size={15} />

                  {isHindi
                    ? "पशु देखें"
                    : "View Animals"}
                </Link>

              </div>

            </div>

            <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#78d6c4]/10" />

            <PawPrint
              size={145}
              className="absolute bottom-4 right-10 hidden text-white/5 lg:block"
            />

          </section>

          {/* STATS */}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title={
                isHindi
                  ? "कुल पशु"
                  : "Total Animals"
              }
              value={
                loading
                  ? "..."
                  : data.totalAnimals
              }
              icon={
                <PawPrint size={19} />
              }
              iconClass="bg-[#e0f4ef] text-[#28766c]"
              badge={
                isHindi
                  ? "पंजीकृत"
                  : "Registered"
              }
            />

            <StatCard
              title={
                isHindi
                  ? "स्वस्थ पशु"
                  : "Healthy Animals"
              }
              value={
                loading
                  ? "..."
                  : data.healthyAnimals
              }
              icon={
                <HeartPulse
                  size={19}
                />
              }
              iconClass="bg-[#e7f6ed] text-[#31855a]"
              badge={
                isHindi
                  ? "स्वस्थ"
                  : "Healthy"
              }
            />

            <StatCard
              title={
                isHindi
                  ? "स्वास्थ्य चेतावनी"
                  : "Health Alerts"
              }
              value={
                loading
                  ? "..."
                  : data.healthAlerts
              }
              icon={
                <AlertCircle
                  size={19}
                />
              }
              iconClass="bg-[#fff2df] text-[#c47b20]"
              badge={
                isHindi
                  ? "ध्यान दें"
                  : "Attention"
              }
            />

            <StatCard
              title={
                isHindi
                  ? "AI भविष्यवाणियां"
                  : "AI Predictions"
              }
              value={
                loading
                  ? "..."
                  : data.totalPredictions
              }
              icon={
                <Microscope
                  size={19}
                />
              }
              iconClass="bg-[#e8edf8] text-[#4b6090]"
              badge={
                isHindi
                  ? "AI विश्लेषण"
                  : "AI Analysis"
              }
            />

          </section>

          {/* SECOND STATS */}

          <section className="mt-4 grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl border border-[#c7ded9] bg-white p-5 shadow-sm dark:border-[#28514d] dark:bg-[#163331]">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf5f4] text-[#38746d]">
                    <Database
                      size={17}
                    />
                  </div>

                  <div>

                    <p className="text-[11px] font-medium text-slate-500 dark:text-[#9bb7b3]">
                      {isHindi
                        ? "रोग लाइब्रेरी"
                        : "Disease Library"}
                    </p>

                    <p className="text-xl font-bold text-[#173b39] dark:text-[#e5f4f1]">
                      {loading
                        ? "..."
                        : data.totalDiseases}
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-[#eef8f4] px-2.5 py-1 text-[9px] font-bold text-[#28766c]">
                  {isHindi
                    ? "रोग"
                    : "Diseases"}
                </span>

              </div>

            </div>

            <div className="rounded-xl border border-[#c7ded9] bg-white p-5 shadow-sm dark:border-[#28514d] dark:bg-[#163331]">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef0f8] text-[#596b9b]">
                    <Activity
                      size={17}
                    />
                  </div>

                  <div>

                    <p className="text-[11px] font-medium text-slate-500 dark:text-[#9bb7b3]">
                      {isHindi
                        ? "औसत AI विश्वसनीयता"
                        : "Average AI Confidence"}
                    </p>

                    <p className="text-xl font-bold text-[#173b39] dark:text-[#e5f4f1]">
                      {loading
                        ? "..."
                        : `${data.averageConfidence}%`}
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-[#eef0f8] px-2.5 py-1 text-[9px] font-bold text-[#596b9b]">
                  {isHindi
                    ? "AI सटीकता"
                    : "AI Accuracy"}
                </span>

              </div>

            </div>

          </section>

          {/* MAIN CONTENT */}

          <section className="mt-6 grid gap-5 xl:grid-cols-3">

            {/* RECENT ANIMALS */}

            <div className="rounded-2xl border border-[#c7ded9] bg-white p-5 shadow-sm dark:border-[#28514d] dark:bg-[#163331]">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-base font-bold text-[#173b39] dark:text-[#e5f4f1]">
                    {isHindi
                      ? "हाल के पशु"
                      : "Recent Animals"}
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-500 dark:text-[#9bb7b3]">
                    {isHindi
                      ? "हाल ही में पंजीकृत पशु"
                      : "Recently registered animals"}
                  </p>

                </div>

                <Link
                  href="/animal/list"
                  className="text-[10px] font-bold text-[#28766c]"
                >
                  {isHindi
                    ? "सभी देखें →"
                    : "View All →"}
                </Link>

              </div>

              {data.recentAnimals
                .length === 0 ? (

                <EmptyState
                  icon={
                    <PawPrint size={18} />
                  }
                  title={
                    isHindi
                      ? "अभी कोई पशु नहीं जोड़ा गया"
                      : "No animals added yet"
                  }
                  text={
                    isHindi
                      ? "स्वास्थ्य निगरानी शुरू करने के लिए अपना पहला पशु जोड़ें।"
                      : "Add your first animal to start health monitoring."
                  }
                  href="/animal"
                  action={
                    isHindi
                      ? "पशु जोड़ें"
                      : "Add Animal"
                  }
                />

              ) : (

                <div className="mt-4 overflow-x-auto">

                  <table className="w-full min-w-[550px]">

                    <thead>

                      <tr className="border-b border-slate-100 text-left dark:border-[#294b47]">

                        <th className="pb-2.5 text-[10px] font-semibold text-slate-400">
                          {isHindi
                            ? "पशु"
                            : "Animal"}
                        </th>

                        <th className="pb-2.5 text-[10px] font-semibold text-slate-400">
                          {isHindi
                            ? "प्रकार"
                            : "Type"}
                        </th>

                        <th className="pb-2.5 text-[10px] font-semibold text-slate-400">
                          {isHindi
                            ? "नस्ल"
                            : "Breed"}
                        </th>

                        <th className="pb-2.5 text-[10px] font-semibold text-slate-400">
                          {isHindi
                            ? "स्वास्थ्य"
                            : "Health"}
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {data.recentAnimals.map(
                        (animal) => {

                          const healthy =
                            !animal.healthStatus ||
                            animal.healthStatus
                              .toLowerCase() ===
                              "healthy";

                          return (
                            <tr
                              key={
                                animal.id
                              }
                              className="border-b border-slate-50 last:border-0 dark:border-[#294b47]"
                            >

                              <td className="py-3">

                                <div className="flex items-center gap-2.5">

                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e0f4ef] text-[#28766c]">
                                    <PawPrint
                                      size={15}
                                    />
                                  </div>

                                  <div>

                                    <p className="text-xs font-bold text-slate-700 dark:text-[#d3e8e4]">
                                      {
                                        animal.name
                                      }
                                    </p>

                                    <p className="text-[9px] text-slate-400">
                                      {
                                        animal.gender ||
                                        "—"
                                      }
                                    </p>

                                  </div>

                                </div>

                              </td>

                              <td className="py-3 text-[10px] text-slate-600 dark:text-[#b7d0cc]">
                                {
                                  animal.type
                                }
                              </td>

                              <td className="py-3 text-[10px] text-slate-500 dark:text-[#9bb7b3]">
                                {
                                  animal.breed ||
                                  "—"
                                }
                              </td>

                              <td className="py-3">

                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold ${
                                    healthy
                                      ? "bg-[#e8f6ed] text-[#31855a]"
                                      : "bg-[#fff1df] text-[#bd741c]"
                                  }`}
                                >

                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      healthy
                                        ? "bg-[#43a66c]"
                                        : "bg-[#d99132]"
                                    }`}
                                  />

                                  {healthy
                                    ? isHindi
                                      ? "स्वस्थ"
                                      : "Healthy"
                                    : animal.healthStatus}

                                </span>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            {/* QUICK ACTIONS */}

            <div className="rounded-2xl border border-[#c7ded9] bg-white p-5 shadow-sm dark:border-[#28514d] dark:bg-[#163331]">

              <h2 className="text-base font-bold text-[#173b39] dark:text-[#e5f4f1]">
                {isHindi
                  ? "त्वरित कार्य"
                  : "Quick Actions"}
              </h2>

              <p className="mt-1 text-[10px] text-slate-500 dark:text-[#9bb7b3]">
                {isHindi
                  ? "अक्सर उपयोग किए जाने वाले फीचर्स"
                  : "Frequently used features"}
              </p>

              <div className="mt-4 space-y-2.5">

                <QuickAction
                  href="/animal"
                  icon={
                    <PawPrint size={17} />
                  }
                  title={
                    isHindi
                      ? "पशु जोड़ें"
                      : "Add Animal"
                  }
                  description={
                    isHindi
                      ? "नया पशु पंजीकृत करें"
                      : "Register a new animal"
                  }
                  type="green"
                />

                <QuickAction
                  href="/prediction"
                  icon={
                    <Upload size={16} />
                  }
                  title={
                    isHindi
                      ? "रोग पहचान"
                      : "Disease Detection"
                  }
                  description={
                    isHindi
                      ? "पशु की तस्वीर अपलोड करें"
                      : "Upload an animal image"
                  }
                  type="blue"
                />

                <QuickAction
                  href="/diseases"
                  icon={
                    <HeartPulse size={16} />
                  }
                  title={
                    isHindi
                      ? "रोग लाइब्रेरी"
                      : "Disease Library"
                  }
                  description={
                    isHindi
                      ? "रोगों की जानकारी देखें"
                      : "Explore disease information"
                  }
                  type="purple"
                />

                <QuickAction
                  href="/history"
                  icon={
                    <ClipboardList
                      size={16}
                    />
                  }
                  title={
                    isHindi
                      ? "रोग इतिहास"
                      : "Prediction History"
                  }
                  description={
                    isHindi
                      ? "पिछले परिणाम देखें"
                      : "View previous results"
                  }
                  type="orange"
                />

              </div>

            </div>

          </section>

          {/* PREDICTIONS + HEALTH */}

          <section className="mt-5 grid gap-5 xl:grid-cols-2">

            {/* RECENT PREDICTIONS */}

            <div className="rounded-2xl border border-[#c7ded9] bg-white p-5 shadow-sm dark:border-[#28514d] dark:bg-[#163331]">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-base font-bold text-[#173b39] dark:text-[#e5f4f1]">
                    {isHindi
                      ? "हाल की भविष्यवाणियां"
                      : "Recent Predictions"}
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-500 dark:text-[#9bb7b3]">
                    {isHindi
                      ? "नवीनतम AI रोग पहचान परिणाम"
                      : "Latest AI disease detection results"}
                  </p>

                </div>

                <Link
                  href="/history"
                  className="text-[10px] font-bold text-[#28766c]"
                >
                  {isHindi
                    ? "सभी देखें →"
                    : "View All →"}
                </Link>

              </div>

              {data.recentPredictions
                .length === 0 ? (

                <EmptyState
                  icon={
                    <Activity size={18} />
                  }
                  title={
                    isHindi
                      ? "अभी कोई भविष्यवाणी नहीं"
                      : "No predictions yet"
                  }
                  text={
                    isHindi
                      ? "आपके AI परिणाम यहां दिखाई देंगे।"
                      : "Your AI detection results will appear here."
                  }
                  href="/prediction"
                  action={
                    isHindi
                      ? "रोग पहचान शुरू करें"
                      : "Start Detection"
                  }
                />

              ) : (

                <div className="mt-4 space-y-2.5">

                  {data.recentPredictions.map(
                    (prediction) => (

                      <div
                        key={
                          prediction.id
                        }
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-[#294b47]"
                      >

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0f4ef] text-[#28766c]">
                          <Stethoscope
                            size={16}
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-xs font-bold text-slate-700 dark:text-[#d3e8e4]">
                            {
                              prediction
                                .disease
                                ?.name ||
                              (isHindi
                                ? "रोग विश्लेषण"
                                : "Disease Analysis")
                            }
                          </p>

                          <p className="mt-0.5 text-[9px] text-slate-400">

                            {
                              prediction
                                .animal
                                ?.name ||
                              (isHindi
                                ? "पशु"
                                : "Animal")
                            }

                            {" • "}

                            {isHindi
                              ? "विश्वसनीयता"
                              : "Confidence"}

                            {" "}

                            {
                              prediction.confidence
                            }%

                          </p>

                        </div>

                        <span className="rounded-full bg-[#eef8f4] px-2 py-1 text-[9px] font-bold text-[#28766c]">
                          {
                            prediction.status
                          }
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* HEALTH OVERVIEW */}

            <div className="rounded-2xl border border-[#c7ded9] bg-white p-5 shadow-sm dark:border-[#28514d] dark:bg-[#163331]">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f6ed] text-[#31855a]">
                  <HeartPulse
                    size={17}
                  />
                </div>

                <div>

                  <h2 className="text-base font-bold text-[#173b39] dark:text-[#e5f4f1]">
                    {isHindi
                      ? "स्वास्थ्य अवलोकन"
                      : "Health Overview"}
                  </h2>

                  <p className="text-[10px] text-slate-500 dark:text-[#9bb7b3]">
                    {isHindi
                      ? "वर्तमान पशु स्वास्थ्य स्थिति"
                      : "Current animal health status"}
                  </p>

                </div>

              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-[#eaf7ef] p-4">

                  <div className="flex items-center gap-2">

                    <CheckCircle2
                      size={16}
                      className="text-[#31855a]"
                    />

                    <p className="text-[10px] font-semibold text-[#31855a]">
                      {isHindi
                        ? "स्वस्थ"
                        : "Healthy"}
                    </p>

                  </div>

                  <p className="mt-2 text-2xl font-bold text-[#286b49]">
                    {loading
                      ? "..."
                      : data.healthyAnimals}
                  </p>

                  <p className="mt-1 text-[9px] text-[#619477]">
                    {isHindi
                      ? "अच्छी स्थिति में पशु"
                      : "Animals in good condition"}
                  </p>

                </div>

                <div className="rounded-xl bg-[#fff3e2] p-4">

                  <div className="flex items-center gap-2">

                    <AlertCircle
                      size={16}
                      className="text-[#c47b20]"
                    />

                    <p className="text-[10px] font-semibold text-[#c47b20]">
                      {isHindi
                        ? "ध्यान दें"
                        : "Attention"}
                    </p>

                  </div>

                  <p className="mt-2 text-2xl font-bold text-[#ad6c1c]">
                    {loading
                      ? "..."
                      : data.healthAlerts}
                  </p>

                  <p className="mt-1 text-[9px] text-[#b58b54]">
                    {isHindi
                      ? "ध्यान देने वाले पशु"
                      : "Animals needing attention"}
                  </p>

                </div>

              </div>

              {/* HEALTH BAR */}

              <div className="mt-5">

                <div className="mb-2 flex justify-between">

                  <p className="text-[10px] font-semibold text-slate-600 dark:text-[#b7d0cc]">
                    {isHindi
                      ? "कुल स्वास्थ्य"
                      : "Overall Health"}
                  </p>

                  <p className="text-[10px] font-bold text-[#28766c]">

                    {data.totalAnimals >
                    0
                      ? Math.round(
                          (data.healthyAnimals /
                            data.totalAnimals) *
                            100
                        )
                      : 0}
                    %

                  </p>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#214440]">

                  <div
                    className="h-full rounded-full bg-[#4fae99] transition-all"
                    style={{
                      width: `${
                        data.totalAnimals >
                        0
                          ? Math.min(
                              100,
                              (data.healthyAnimals /
                                data.totalAnimals) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              RECENT APPOINTMENTS
          ================================================= */}

          <section className="mt-5">

            <div className="rounded-2xl border border-[#c7ded9] bg-white p-5 shadow-sm dark:border-[#28514d] dark:bg-[#163331]">

              {/* HEADER */}

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-base font-bold text-[#173b39] dark:text-[#e5f4f1]">
                    {isHindi
                      ? "हाल के अपॉइंटमेंट"
                      : "Recent Appointments"}
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-500 dark:text-[#9bb7b3]">
                    {isHindi
                      ? "आपके हाल के पशु चिकित्सा अपॉइंटमेंट"
                      : "Your latest veterinary appointments"}
                  </p>

                </div>

                <Link
                  href="/appointments"
                  className="text-[10px] font-bold text-[#28766c] transition hover:text-[#185943]"
                >
                  {isHindi
                    ? "सभी देखें →"
                    : "View All →"}
                </Link>

              </div>

              {/* LIST */}

              {appointments.length ===
              0 ? (

                <div className="mt-4 flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d7e9e4] bg-[#f7fbfa] px-4 text-center dark:border-[#315b56] dark:bg-[#173532]">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#28766c] shadow-sm dark:bg-[#214440]">
                    <CalendarDays
                      size={18}
                    />
                  </div>

                  <h3 className="mt-2 text-xs font-bold text-slate-700 dark:text-[#d3e8e4]">
                    {isHindi
                      ? "अभी कोई अपॉइंटमेंट नहीं"
                      : "No appointments yet"}
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-500 dark:text-[#9bb7b3]">
                    {isHindi
                      ? "अपने पशु के लिए veterinary appointment बुक करें।"
                      : "Book a veterinary appointment for your animal."}
                  </p>

                  <Link
                    href="/appointments"
                    className="mt-2 text-[10px] font-bold text-[#28766c]"
                  >
                    {isHindi
                      ? "अपॉइंटमेंट बुक करें →"
                      : "Book Appointment →"}
                  </Link>

                </div>

              ) : (

                <div className="mt-4 space-y-3">

                  {appointments
                    .slice(0, 4)
                    .map(
                      (appointment) => (

                        <div
                          key={
                            appointment.id
                          }
                          className="rounded-xl border border-[#e0ebe7] bg-[#f9fcfa] p-4 transition hover:border-[#bfd9ce] dark:border-[#294b47] dark:bg-[#173532]"
                        >

                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            {/* LEFT */}

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e0f4ef] text-[#28766c]">
                                <CalendarDays
                                  size={18}
                                />
                              </div>

                              <div className="min-w-0">

                                <p className="text-xs font-bold text-slate-700 dark:text-[#d3e8e4]">
                                  {
                                    appointment
                                      .animal
                                      ?.name ||
                                    (isHindi
                                      ? "पशु"
                                      : "Animal")
                                  }
                                </p>

                                <p className="mt-1 text-[10px] text-slate-400">

                                  {
                                    appointment
                                      .animal
                                      ?.type ||
                                    ""
                                  }

                                  {" • "}

                                  {
                                    appointment.doctorName
                                  }

                                </p>

                              </div>

                            </div>

                            {/* DATE / TIME / STATUS */}

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold text-[#526f64] dark:bg-[#214440] dark:text-[#b7d0cc]">

                                <CalendarDays
                                  size={
                                    12
                                  }
                                />

                                {new Date(
                                  appointment.date
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month:
                                      "short",
                                    year:
                                      "numeric",
                                  }
                                )}

                              </span>

                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold text-[#526f64] dark:bg-[#214440] dark:text-[#b7d0cc]">

                                <Clock3
                                  size={
                                    12
                                  }
                                  className="text-[#28766c]"
                                />

                                {
                                  appointment.time
                                }

                              </span>

                              <span
                                className={`rounded-full px-3 py-1.5 text-[9px] font-bold ${
                                  appointment.status
                                    ?.toLowerCase() ===
                                  "confirmed"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : appointment.status
                                          ?.toLowerCase() ===
                                        "completed"
                                      ? "bg-blue-100 text-blue-700"
                                      : appointment.status
                                            ?.toLowerCase() ===
                                          "cancelled"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {
                                  appointment.status
                                }
                              </span>

                            </div>

                          </div>

                          {appointment.reason && (
                            <p className="mt-3 border-t border-[#e5eee9] pt-3 text-[10px] leading-5 text-slate-500 dark:border-[#294b47] dark:text-[#9bb7b3]">

                              <span className="font-bold text-[#526f64] dark:text-[#b7d0cc]">
                                {isHindi
                                  ? "कारण:"
                                  : "Reason:"}
                              </span>{" "}

                              {
                                appointment.reason
                              }

                            </p>
                          )}

                        </div>

                      )
                    )}

                </div>

              )}

            </div>

          </section>

          {/* FOOTER */}

          <footer className="mt-7 border-t border-[#c4ddd7] py-5 text-center dark:border-[#28514d]">

            <p className="text-[10px] text-slate-400">
              © 2026 AnimalCare •{" "}
              {isHindi
                ? "पशु रोग पहचान प्रणाली"
                : "Animal Disease Detection System"}
            </p>

          </footer>

        </div>

      </main>

      {/* ===================================================== */}
      {/* LOGOUT CONFIRMATION MODAL */}
      {/* ===================================================== */}

      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#d8e8e3] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.25)]">

            {/* MODAL HEADER */}

            <div className="bg-gradient-to-r from-[#103b30] to-[#28775c] px-6 py-5 text-white">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">

                  <LogOut
                    size={21}
                  />

                </div>

                <div>

                  <h2 className="text-base font-bold">
                    {isHindi
                      ? "लॉग आउट की पुष्टि करें"
                      : "Confirm Logout"}
                  </h2>

                  <p className="mt-0.5 text-[11px] text-white/70">
                    {isHindi
                      ? "आपका वर्तमान लॉगिन सत्र समाप्त हो जाएगा।"
                      : "Your current login session will be ended."}
                  </p>

                </div>

              </div>

            </div>

            {/* MODAL BODY */}

            <div className="px-6 py-6">

              <p className="text-sm leading-6 text-slate-600">
                {isHindi
                  ? "क्या आप वाकई अपने खाते से लॉग आउट करना चाहते हैं?"
                  : "Are you sure you want to logout from your account?"}
              </p>

              {/* BUTTONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setLogoutConfirmOpen(
                      false
                    )
                  }
                  disabled={
                    loggingOut
                  }
                  className="rounded-xl border border-[#d7e5df] bg-white px-5 py-3 text-sm font-bold text-[#48665c] transition hover:bg-[#f4f8f6] disabled:opacity-50"
                >
                  {isHindi
                    ? "रद्द करें"
                    : "Cancel"}
                </button>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  disabled={
                    loggingOut
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loggingOut ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      {isHindi
                        ? "लॉग आउट हो रहा है..."
                        : "Logging out..."}
                    </>
                  ) : (
                    <>
                      <LogOut
                        size={16}
                      />

                      {isHindi
                        ? "लॉग आउट"
                        : "Logout"}
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ========================================================= */
/* MENU ITEM */
/* ========================================================= */

function MenuItem({
  href,
  icon,
  title,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
        active
          ? "bg-[#66c7b5] text-[#123c3a] shadow-sm"
          : "text-[#c0d9d5] hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {title}
    </Link>
  );
}

/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({
  title,
  value,
  icon,
  iconClass,
  badge,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconClass: string;
  badge: string;
}) {
  return (
    <div className="rounded-xl border border-[#c7ded9] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#28514d] dark:bg-[#163331]">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>

        <span className="rounded-full bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-500 dark:bg-[#214440] dark:text-[#9bb7b3]">
          {badge}
        </span>

      </div>

      <p className="mt-4 text-[10px] font-medium text-slate-500 dark:text-[#9bb7b3]">
        {title}
      </p>

      <h3 className="mt-0.5 text-2xl font-bold text-[#173b39] dark:text-[#e5f4f1]">
        {value}
      </h3>

    </div>
  );
}

/* ========================================================= */
/* EMPTY STATE */
/* ========================================================= */

function EmptyState({
  icon,
  title,
  text,
  href,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mt-4 flex min-h-[130px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d7e9e4] bg-[#f7fbfa] px-4 text-center dark:border-[#315b56] dark:bg-[#173532]">

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-[#214440]">
        {icon}
      </div>

      <h3 className="mt-2 text-xs font-bold text-slate-700 dark:text-[#d3e8e4]">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-[10px] text-slate-500 dark:text-[#9bb7b3]">
        {text}
      </p>

      <Link
        href={href}
        className="mt-2 text-[10px] font-bold text-[#28766c]"
      >
        {action} →
      </Link>

    </div>
  );
}

/* ========================================================= */
/* QUICK ACTION */
/* ========================================================= */

function QuickAction({
  href,
  icon,
  title,
  description,
  type,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  type:
    | "green"
    | "blue"
    | "purple"
    | "orange";
}) {
  const styles = {
    green: {
      box: "bg-[#e0f4ef] text-[#28766c]",
      hover:
        "hover:border-[#b8ded5] hover:bg-[#f5fbf9]",
    },

    blue: {
      box: "bg-[#e9eef9] text-[#506697]",
      hover:
        "hover:border-[#cbd6eb] hover:bg-[#f8f9fc]",
    },

    purple: {
      box: "bg-[#f0eafa] text-[#765a9b]",
      hover:
        "hover:border-[#ddd0ed] hover:bg-[#faf8fd]",
    },

    orange: {
      box: "bg-[#fff1df] text-[#bd741c]",
      hover:
        "hover:border-[#f1d7b2] hover:bg-[#fffaf4]",
    },
  };

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition dark:border-[#294b47] ${styles[type].hover}`}
    >

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles[type].box}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <h3 className="text-[11px] font-bold text-slate-700 dark:text-[#d3e8e4]">
          {title}
        </h3>

        <p className="mt-0.5 text-[9px] text-slate-400 dark:text-[#819f9a]">
          {description}
        </p>

      </div>

      <ChevronRight
        size={14}
        className="text-slate-300 transition group-hover:translate-x-1"
      />

    </Link>
  );
}