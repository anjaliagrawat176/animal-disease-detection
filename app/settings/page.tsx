"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronDown,
  Globe2,
  KeyRound,
  Loader2,
  LogOut,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { useThemeLanguage } from "@/components/ThemeLanguageProvider";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phoneno: string | null;
};

export default function SettingsPage() {
  const {
    theme,
    language,
    toggleTheme,
    setLanguage,
  } = useThemeLanguage();

  const [profile, setProfile] =
    useState<UserProfile>({
      id: "",
      name: "",
      email: "",
      phoneno: "",
    });

  const [profileLoading, setProfileLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [forgotEmail, setForgotEmail] =
    useState("");

  const [forgotLoading, setForgotLoading] =
    useState(false);

  const [resetUrl, setResetUrl] =
    useState("");

  const [notifications, setNotifications] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      setError("");

      const response = await fetch(
        "/api/profile",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to load profile."
        );
      }

      setProfile({
        id: result.data?.id || "",
        name: result.data?.name || "",
        email: result.data?.email || "",
        phoneno:
          result.data?.phoneno || "",
      });

      setForgotEmail(
        result.data?.email || ""
      );
    } catch (error) {
      console.error(
        "Load profile error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleSaveProfile =
    async () => {
      setMessage("");
      setError("");

      if (!profile.name.trim()) {
        setError(
          "Please enter your name."
        );
        return;
      }

      try {
        setSavingProfile(true);

        const response = await fetch(
          "/api/profile",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name: profile.name.trim(),
              phoneno:
                profile.phoneno?.trim() || "",
            }),
          }
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Profile update failed."
          );
        }

        setMessage(
          "Profile updated successfully."
        );

        if (result.data) {
          setProfile((current) => ({
            ...current,
            name:
              result.data.name ??
              current.name,
            phoneno:
              result.data.phoneno ??
              current.phoneno,
          }));
        }
      } catch (error) {
        console.error(
          "Update profile error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to update profile."
        );
      } finally {
        setSavingProfile(false);
      }
    };

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPassword =
    async () => {
      setMessage("");
      setError("");
      setResetUrl("");

      const email =
        forgotEmail.trim().toLowerCase();

      if (!email) {
        setError(
          "Please enter your registered email."
        );
        return;
      }

      try {
        setForgotLoading(true);

        const response =
          await fetch(
            "/api/auth/forgot-password",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                email,
              }),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Unable to generate reset link."
          );
        }

        setMessage(
          result.message ||
            "Password reset link generated."
        );

        if (result.resetUrl) {
          setResetUrl(
            result.resetUrl
          );
        }
      } catch (error) {
        console.error(
          "Forgot password error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to generate reset link."
        );
      } finally {
        setForgotLoading(false);
      }
    };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Logout failed."
        );
      }

      window.location.href =
        "/login";
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Logout failed."
      );
    }
  };

  const dark = theme === "dark";

  return (
    <main
      className={
        dark
          ? "min-h-screen bg-[#071d18] px-4 py-6 sm:px-6 lg:px-8"
          : "min-h-screen bg-[#f4f8f6] px-4 py-6 sm:px-6 lg:px-8"
      }
    >
      <div className="mx-auto max-w-5xl">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="mb-6 flex items-center justify-between">

          <Link
            href="/dashboard"
            className={
              dark
                ? "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#c9e6da] transition hover:bg-white/5"
                : "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#31584b] transition hover:bg-white"
            }
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

          <div
            className={
              dark
                ? "hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:flex"
                : "hidden items-center gap-2 rounded-full border border-[#d8e8e0] bg-white px-4 py-2 sm:flex"
            }
          >
            <ShieldCheck
              size={16}
              className="text-[#28755b]"
            />

            <span
              className={
                dark
                  ? "text-xs font-semibold text-[#b8d8cc]"
                  : "text-xs font-semibold text-[#537568]"
              }
            >
              Account Settings
            </span>
          </div>

        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div
          className={
            dark
              ? "overflow-hidden rounded-[30px] border border-[#234b40] bg-[#102c25] shadow-[0_25px_70px_rgba(0,0,0,0.25)]"
              : "overflow-hidden rounded-[30px] border border-[#d9e7e1] bg-white shadow-[0_20px_60px_rgba(25,70,55,0.08)]"
          }
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="relative overflow-hidden bg-gradient-to-r from-[#103b30] via-[#185943] to-[#28775c] px-6 py-9 text-white sm:px-10">

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5" />

            <div className="relative z-10 flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <Palette size={28} />
              </div>

              <div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b8e4d1]">
                  Personal Preferences
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Settings
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d8eee4]/80">
                  Manage your profile, appearance,
                  language, password and account.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="space-y-8 p-6 sm:p-9">

            {/* SUCCESS */}

            {message && (
              <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">

                <div className="flex items-center gap-3">

                  <CheckCircle2
                    size={19}
                  />

                  {message}

                </div>

                {resetUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href =
                        resetUrl;
                    }}
                    className="w-fit rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                  >
                    Open Reset Password
                  </button>
                )}

              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* =================================================
                PROFILE
            ================================================= */}

            <section>

              <div className="mb-5">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                  01
                </p>

                <h2
                  className={
                    dark
                      ? "mt-1 text-xl font-bold text-white"
                      : "mt-1 text-xl font-bold text-[#203b33]"
                  }
                >
                  Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your personal information.
                </p>

              </div>

              {profileLoading ? (

                <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-[#dce8e2] bg-[#f8fbf9]">

                  <div className="text-center">

                    <Loader2
                      size={28}
                      className="mx-auto animate-spin text-[#28755b]"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      Loading profile...
                    </p>

                  </div>

                </div>

              ) : (

                <div className="grid gap-5 md:grid-cols-2">

                  {/* NAME */}

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#537568]">
                      Full Name
                    </label>

                    <div className="relative">

                      <UserRound
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6c8c80]"
                      />

                      <input
                        type="text"
                        value={
                          profile.name
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            name: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-11 py-4 text-sm font-semibold text-[#30483f] outline-none transition focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                      />

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#537568]">
                      Email
                    </label>

                    <input
                      type="email"
                      value={
                        profile.email
                      }
                      disabled
                      className="w-full cursor-not-allowed rounded-2xl border border-[#d9e6e0] bg-[#eef3f1] px-4 py-4 text-sm font-semibold text-slate-500 outline-none"
                    />

                    <p className="mt-1 text-[10px] text-slate-400">
                      Email is kept read-only.
                    </p>

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#537568]">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      value={
                        profile.phoneno ||
                        ""
                      }
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          phoneno:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-4 py-4 text-sm font-semibold text-[#30483f] outline-none transition focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                    />

                  </div>

                  {/* SAVE */}

                  <div className="flex items-end">

                    <button
                      type="button"
                      onClick={
                        handleSaveProfile
                      }
                      disabled={
                        savingProfile
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#17634d] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#125541] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                    >

                      {savingProfile ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={17} />
                          Save Profile
                        </>
                      )}

                    </button>

                  </div>

                </div>

              )}

            </section>

            {/* =================================================
                APPEARANCE
            ================================================= */}

            <section className="border-t border-[#e2ebe7] pt-8">

              <div className="mb-5">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                  02
                </p>

                <h2
                  className={
                    dark
                      ? "mt-1 text-xl font-bold text-white"
                      : "mt-1 text-xl font-bold text-[#203b33]"
                  }
                >
                  Appearance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose how AnimalCare looks.
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* LIGHT */}

                <button
                  type="button"
                  onClick={() => {
                    if (theme === "dark") {
                      toggleTheme();
                    }
                  }}
                  className={
                    theme === "light"
                      ? "rounded-2xl border border-[#2b8063] bg-[#eef8f3] p-5 text-left transition"
                      : "rounded-2xl border border-[#dce8e2] bg-[#f9fbfa] p-5 text-left transition hover:border-[#b9d8ca]"
                  }
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#28755b] shadow-sm">
                      <Sun size={23} />
                    </div>

                    <div>

                      <h3 className="text-sm font-bold text-[#31584b]">
                        Light
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Clean and comfortable
                      </p>

                    </div>

                  </div>

                </button>

                {/* DARK */}

                <button
                  type="button"
                  onClick={() => {
                    if (theme === "light") {
                      toggleTheme();
                    }
                  }}
                  className={
                    theme === "dark"
                      ? "rounded-2xl border border-[#63b99a] bg-[#173b31] p-5 text-left transition"
                      : "rounded-2xl border border-[#dce8e2] bg-[#f9fbfa] p-5 text-left transition hover:border-[#b9d8ca]"
                  }
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173b31] text-[#9edbc2]">
                      <Moon size={23} />
                    </div>

                    <div>

                      <h3
                        className={
                          dark
                            ? "text-sm font-bold text-white"
                            : "text-sm font-bold text-[#31584b]"
                        }
                      >
                        Dark
                      </h3>

                      <p
                        className={
                          dark
                            ? "mt-1 text-xs text-[#a8cabe]"
                            : "mt-1 text-xs text-slate-400"
                        }
                      >
                        Comfortable at night
                      </p>

                    </div>

                  </div>

                </button>

              </div>

            </section>

            {/* =================================================
                LANGUAGE
            ================================================= */}

            <section className="border-t border-[#e2ebe7] pt-8">

              <div className="mb-5">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                  03
                </p>

                <h2
                  className={
                    dark
                      ? "mt-1 text-xl font-bold text-white"
                      : "mt-1 text-xl font-bold text-[#203b33]"
                  }
                >
                  Language
                </h2>

              </div>

              <div className="relative max-w-md">

                <Globe2
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6c8c80]"
                />

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(
                      e.target.value as
                        | "en"
                        | "hi"
                    )
                  }
                  className="w-full appearance-none rounded-2xl border border-[#d9e6e0] bg-[#f8fbf9] px-11 py-4 pr-12 text-sm font-semibold text-[#30483f] outline-none transition focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
                >
                  <option value="en">
                    English
                  </option>

                  <option value="hi">
                    हिन्दी
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6c8c80]"
                />

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Language preference is saved automatically.
              </p>

            </section>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <section className="border-t border-[#e2ebe7] pt-8">

              <div className="mb-5">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                  04
                </p>

                <h2
                  className={
                    dark
                      ? "mt-1 text-xl font-bold text-white"
                      : "mt-1 text-xl font-bold text-[#203b33]"
                  }
                >
                  Notifications
                </h2>

              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-[#dce8e2] bg-[#f9fbfa] p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e4f3eb] text-[#28755b]">
                    <Bell size={20} />
                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-[#31584b]">
                      Appointment Notifications
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Notification preference for future updates.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications(
                      !notifications
                    )
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    notifications
                      ? "bg-[#28755b]"
                      : "bg-slate-300"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </section>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <section className="border-t border-[#e2ebe7] pt-8">

              <div className="mb-5">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#78958b]">
                  05
                </p>

                <h2
                  className={
                    dark
                      ? "mt-1 text-xl font-bold text-white"
                      : "mt-1 text-xl font-bold text-[#203b33]"
                  }
                >
                  Password & Security
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Generate a password reset link for your account.
                </p>

              </div>

              <div className="max-w-2xl rounded-2xl border border-[#dce8e2] bg-[#f9fbfa] p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e4f3eb] text-[#28755b]">
                    <KeyRound size={20} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="text-sm font-bold text-[#31584b]">
                      Forgot Password?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Generate a secure password reset link using your registered email.
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                      <input
                        type="email"
                        value={
                          forgotEmail
                        }
                        onChange={(e) =>
                          setForgotEmail(
                            e.target.value
                          )
                        }
                        placeholder="Registered email"
                        className="min-w-0 flex-1 rounded-xl border border-[#d9e6e0] bg-white px-4 py-3 text-sm text-[#30483f] outline-none transition focus:border-[#2b8063] focus:ring-4 focus:ring-[#2b8063]/10"
                      />

                      <button
                        type="button"
                        onClick={
                          handleForgotPassword
                        }
                        disabled={
                          forgotLoading
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17634d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#125541] disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        {forgotLoading ? (
                          <>
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                            Generating...
                          </>
                        ) : (
                          <>
                            <KeyRound
                              size={17}
                            />
                            Reset Password
                          </>
                        )}

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                LOGOUT
            ================================================= */}

            <section className="border-t border-[#e2ebe7] pt-8">

              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-sm font-bold text-red-700">
                      Sign out of your account
                    </h3>

                    <p className="mt-1 text-xs text-red-500/70">
                      Your current login session will be ended.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                  >

                    <LogOut size={17} />

                    Logout

                  </button>

                </div>

              </div>

            </section>

          </div>
        </div>

        {/* FOOTER */}

        <p className="mt-5 pb-2 text-center text-[11px] text-[#78958b]">
          AnimalCare
          <span className="mx-2">
            •
          </span>
          Settings & Preferences
        </p>

      </div>
    </main>
  );
}