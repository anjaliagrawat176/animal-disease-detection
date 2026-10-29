"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  HeartPulse,
  ImagePlus,
  Images,
  PawPrint,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

export default function AddAnimalPage() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    pregnancyStatus: "",
    healthStatus: "Healthy",
    userId: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cameraInputRef =
    useRef<HTMLInputElement | null>(null);

  const galleryInputRef =
    useRef<HTMLInputElement | null>(null);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      // If gender becomes Male,
      // remove pregnancy selection.
      ...(name === "gender" &&
      value !== "Female"
        ? {
            pregnancyStatus: "",
          }
        : {}),
    }));
  };

  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5 MB."
      );
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    e.target.value = "";
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = () => {
    setImage(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name.trim() ||
      !formData.type
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    // Female animal must have pregnancy status
    if (
      formData.gender === "Female" &&
      !formData.pregnancyStatus
    ) {
      setError(
        "Please select pregnancy status."
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "type",
        formData.type
      );

      data.append(
        "breed",
        formData.breed.trim()
      );

      data.append(
        "age",
        formData.age
      );

      data.append(
        "gender",
        formData.gender
      );

      data.append(
        "pregnancyStatus",
        formData.pregnancyStatus
      );

      data.append(
        "healthStatus",
        formData.healthStatus
      );

      // Kept for compatibility
      // with your existing form.
      if (formData.userId.trim()) {
        data.append(
          "userId",
          formData.userId.trim()
        );
      }

      if (image) {
        data.append(
          "image",
          image
        );
      }

      const response =
        await fetch(
          "/api/animal/add",
          {
            method: "POST",
            credentials: "include",
            body: data,
          }
        );

      const result =
        await response.json();

      console.log(
        "Add Animal Response:",
        result
      );

      if (
        response.ok &&
        result.success
      ) {
        setMessage(
          "Animal added successfully!"
        );

        setFormData({
          name: "",
          type: "",
          breed: "",
          age: "",
          gender: "",
          pregnancyStatus: "",
          healthStatus: "Healthy",
          userId: "",
        });

        removeImage();
      } else {
        setError(
          result.message ||
            "Unable to add animal."
        );
      }
    } catch (error) {
      console.error(
        "Add animal error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#061c17] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* TOP BAR */}

        <div className="mb-6 flex items-center justify-between">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#b8d9ce] transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:flex">

            <ShieldCheck
              size={16}
              className="text-[#7ed0ad]"
            />

            <span className="text-xs font-semibold text-[#a9c9be]">
              Secure Animal Records
            </span>

          </div>

        </div>

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-[28px] border border-[#d2e8dd] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.25)]">

          {/* HEADER */}

          <div className="relative overflow-hidden bg-gradient-to-r from-[#092c23] via-[#12513f] to-[#1e7559] px-6 py-9 text-white sm:px-10 lg:px-12">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/[0.07] bg-white/[0.04]" />

            <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#5ebc95]/10" />

            <div className="relative z-10 flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">

                <PawPrint
                  size={28}
                  strokeWidth={1.8}
                />

              </div>

              <div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a9dec8]">
                  Animal Management
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Add New Animal
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d4ebe2]/75">
                  Add your animal&apos;s details and
                  photo to start monitoring its health
                  and disease detection history.
                </p>

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="bg-white p-6 sm:p-9 lg:p-11">

            {/* SUCCESS */}

            {message && (
              <div className="mb-7 flex items-center gap-3 rounded-xl border border-[#bfe3d0] bg-[#effaf4] px-4 py-3.5 text-sm font-semibold text-[#287052]">

                <CheckCircle2 size={18} />

                {message}

              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mb-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* BASIC INFORMATION */}

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2f2ea] text-[#28755b]">
                  <PawPrint size={19} />
                </div>

                <div>

                  <h2 className="text-sm font-bold text-[#203b33]">
                    Basic Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Enter your animal&apos;s basic details
                  </p>

                </div>

              </div>

              {/* PHOTO UPLOAD */}

              <div className="mb-8">

                <label className="mb-2 block text-xs font-bold text-[#30483f]">

                  Animal Photo

                  <span className="ml-1 text-slate-400">
                    (Optional)
                  </span>

                </label>

                {!imagePreview ? (

                  <div className="rounded-2xl border-2 border-dashed border-[#bcd8ca] bg-[#f7fbf8] p-6 sm:p-8">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e4f3eb] text-[#28755b]">

                      <ImagePlus size={27} />

                    </div>

                    <div className="mt-4 text-center">

                      <p className="text-sm font-bold text-[#31584b]">
                        Add Animal Photo
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Take a photo using camera or
                        choose one from your gallery
                      </p>

                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

                      <button
                        type="button"
                        onClick={() =>
                          cameraInputRef.current?.click()
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17634d] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#20795d]"
                      >
                        <Camera size={18} />
                        Take Photo
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          galleryInputRef.current?.click()
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cfe1d8] bg-white px-5 py-3 text-sm font-semibold text-[#28755b] transition hover:bg-[#edf7f1]"
                      >
                        <Images size={18} />
                        Choose from Gallery
                      </button>

                    </div>

                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <p className="mt-4 text-center text-[10px] text-slate-400">
                      JPG, JPEG, PNG or WEBP • Maximum 5 MB
                    </p>

                  </div>

                ) : (

                  <div className="relative overflow-hidden rounded-2xl border border-[#c6dfd2] bg-[#f7fbf8] p-3">

                    <div className="relative h-[260px] overflow-hidden rounded-xl bg-[#edf5f1] sm:h-[330px]">

                      <img
                        src={imagePreview}
                        alt="Animal preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                        title="Remove photo"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                    <div className="flex flex-col gap-3 px-1 pt-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="min-w-0">

                        <p className="truncate text-xs font-semibold text-[#31584b]">
                          {image?.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          Photo selected successfully
                        </p>

                      </div>

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            cameraInputRef.current?.click()
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cfe1d8] bg-white px-3 py-2 text-xs font-semibold text-[#28755b] transition hover:bg-[#edf7f1]"
                        >
                          <Camera size={15} />
                          Camera
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            galleryInputRef.current?.click()
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17634d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#20795d]"
                        >
                          <Images size={15} />
                          Gallery
                        </button>

                      </div>

                    </div>

                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </div>
                )}

              </div>

              {/* FORM FIELDS */}

              <div className="grid gap-x-7 gap-y-5 md:grid-cols-2">

                <InputField
                  label="Animal Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Bruno"
                  required
                />

                <SelectField
                  label="Animal Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  options={[
                    {
                      value: "Cow",
                      label: "Cow",
                    },
                    {
                      value: "Buffalo",
                      label: "Buffalo",
                    },
                    {
                      value: "Goat",
                      label: "Goat",
                    },
                    {
                      value: "Sheep",
                      label: "Sheep",
                    },
                    {
                      value: "Dog",
                      label: "Dog",
                    },
                    {
                      value: "Cat",
                      label: "Cat",
                    },
                    {
                      value: "Other",
                      label: "Other",
                    },
                  ]}
                />

                <InputField
                  label="Breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="e.g. Jersey"
                />

                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  min="0"
                />

                <SelectField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Male",
                      label: "Male",
                    },
                    {
                      value: "Female",
                      label: "Female",
                    },
                  ]}
                />

                {/* =================================================
                    PREGNANCY STATUS
                    ONLY VISIBLE FOR FEMALE
                ================================================= */}

                {formData.gender === "Female" && (
                  <SelectField
                    label="Pregnancy Status"
                    name="pregnancyStatus"
                    value={formData.pregnancyStatus}
                    onChange={handleChange}
                    required
                    options={[
                      {
                        value: "Pregnant",
                        label: "Pregnant",
                      },
                      {
                        value: "Not Pregnant",
                        label: "Not Pregnant",
                      },
                      {
                        value: "Unknown",
                        label: "Unknown",
                      },
                    ]}
                  />
                )}

                <SelectField
                  label="Health Status"
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                  options={[
                    {
                      value: "Healthy",
                      label: "Healthy",
                    },
                    {
                      value: "Needs Attention",
                      label: "Needs Attention",
                    },
                    {
                      value: "Under Treatment",
                      label: "Under Treatment",
                    },
                  ]}
                />

              </div>

              {/* DIVIDER */}

              <div className="my-9 h-px bg-[#dce9e3]" />

              {/* OWNER INFORMATION */}

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f0f5] text-[#426b84]">
                  <UserRound size={19} />
                </div>

                <div>

                  <h2 className="text-sm font-bold text-[#203b33]">
                    Owner Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Enter the User ID connected to this animal
                  </p>

                </div>

              </div>

              <InputField
                label="User ID"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Enter your User ID"
                required
              />

              {/* HEALTH INFORMATION */}

              <div className="mt-7 rounded-2xl border border-[#c9e1d5] bg-gradient-to-r from-[#eaf6ef] to-[#f0f9f4] p-4 sm:p-5">

                <div className="flex gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2b8063] shadow-sm">
                    <HeartPulse size={19} />
                  </div>

                  <div>

                    <p className="text-xs font-bold text-[#245b4a]">
                      Health Monitoring
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      You can update the animal&apos;s
                      health status later as its
                      condition changes.
                    </p>

                  </div>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#dce9e3] pt-6 sm:flex-row sm:justify-end">

                <Link
                  href="/animal/list"
                  className="inline-flex items-center justify-center rounded-xl border border-[#d5e2dc] bg-white px-7 py-3 text-sm font-semibold text-slate-600 transition hover:bg-[#f5f8f6]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1d664f] to-[#2b8063] px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />

                  {loading
                    ? "Saving..."
                    : "Save Animal"}
                </button>

              </div>

            </form>

          </div>
        </div>

        {/* FOOTER */}

        <p className="mt-5 pb-2 text-center text-[11px] text-[#63847a]">
          AnimalCare
          <span className="mx-2 text-[#39675a]">
            •
          </span>
          Animal Disease Detection System
        </p>

      </div>
    </main>
  );
}

// =====================================================
// INPUT FIELD
// =====================================================

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  min?: string;
};

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
}: InputProps) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-[#30483f]">

        {label}

        {required && (
          <span className="ml-1 text-[#2b8063]">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-xl border border-[#d9e6e0] bg-[#f8fbf9] px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-[#a9cbbb] hover:bg-white focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
      />

    </div>
  );
}

// =====================================================
// SELECT FIELD
// =====================================================

type SelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  options: {
    value: string;
    label: string;
  }[];
  required?: boolean;
};

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: SelectProps) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold text-[#30483f]">

        {label}

        {required && (
          <span className="ml-1 text-[#2b8063]">
            *
          </span>
        )}

      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full cursor-pointer rounded-xl border border-[#d9e6e0] bg-[#f8fbf9] px-4 py-3.5 text-sm text-slate-800 outline-none transition-all hover:border-[#a9cbbb] hover:bg-white focus:border-[#2b8063] focus:bg-white focus:ring-4 focus:ring-[#2b8063]/10"
      >

        <option value="">
          Select {label.toLowerCase()}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
}