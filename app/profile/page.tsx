"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  PawPrint,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  phoneno: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load profile");
        }

        setUser(result.data);
      } catch (error) {
        console.error("Profile loading error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#e3f0ed] px-5 py-7 text-slate-800">

      {/* HEADER */}
      <div className="mx-auto max-w-4xl">

        <div className="mb-6 flex items-center gap-3">

          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c8ded9] bg-white text-[#28766c] transition hover:bg-[#eef8f4]"
          >
            <ArrowLeft size={17} />
          </Link>

          <div>
            <h1 className="text-xl font-bold text-[#173b39]">
              My Profile
            </h1>

            <p className="text-[10px] text-slate-500">
              Manage your account information
            </p>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        {loading ? (

          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#c8ded9] bg-white shadow-sm">

            <Loader2
              size={30}
              className="animate-spin text-[#28766c]"
            />

            <p className="mt-3 text-sm font-semibold text-slate-600">
              Loading profile...
            </p>

          </div>

        ) : user ? (

          <div className="overflow-hidden rounded-2xl border border-[#c8ded9] bg-white shadow-sm">

            {/* PROFILE TOP */}
            <div className="bg-[#245c56] px-6 py-7 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#78d6c4] text-[#123c3a]">
                  <User size={30} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {user.name}
                  </h2>

                  <p className="mt-1 text-xs text-[#cce5e1]">
                    Animal Owner
                  </p>
                </div>

              </div>

            </div>

            {/* PROFILE DETAILS */}
            <div className="p-6">

              <h3 className="mb-4 text-sm font-bold text-[#173b39]">
                Account Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* NAME */}
                <div className="rounded-xl bg-[#f4faf8] p-4">

                  <div className="flex items-center gap-2 text-[#28766c]">
                    <User size={16} />

                    <span className="text-[10px] font-bold">
                      Full Name
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {user.name}
                  </p>

                </div>

                {/* EMAIL */}
                <div className="rounded-xl bg-[#f4faf8] p-4">

                  <div className="flex items-center gap-2 text-[#28766c]">
                    <Mail size={16} />

                    <span className="text-[10px] font-bold">
                      Email Address
                    </span>
                  </div>

                  <p className="mt-2 break-all text-sm font-semibold text-slate-700">
                    {user.email}
                  </p>

                </div>

                {/* PHONE */}
                <div className="rounded-xl bg-[#f4faf8] p-4">

                  <div className="flex items-center gap-2 text-[#28766c]">
                    <Phone size={16} />

                    <span className="text-[10px] font-bold">
                      Phone Number
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {user.phoneno || "Not provided"}
                  </p>

                </div>

                {/* ACCOUNT */}
                <div className="rounded-xl bg-[#f4faf8] p-4">

                  <div className="flex items-center gap-2 text-[#28766c]">
                    <ShieldCheck size={16} />

                    <span className="text-[10px] font-bold">
                      Account
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#31855a]">
                    Active
                  </p>

                </div>

              </div>

              {/* ANIMAL LINK */}
              <div className="mt-5 rounded-xl border border-[#d8ebe6] bg-[#f8fcfb] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e0f4ef] text-[#28766c]">
                    <PawPrint size={18} />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700">
                      Manage Your Animals
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      View and manage your registered animals.
                    </p>
                  </div>

                  <Link
                    href="/animal/list"
                    className="rounded-lg bg-[#245c56] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-[#194943]"
                  >
                    View Animals
                  </Link>

                </div>

              </div>

            </div>

          </div>

        ) : null}

      </div>
    </div>
  );
}