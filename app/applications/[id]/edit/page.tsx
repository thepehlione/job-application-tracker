"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { applicationApiRepo } from "@/data/applicationApiRepo";
import type { ApplicationStatus, JobApplication } from "@/types/application";

// ✏️ Edit form için schema
const editSchema = z.object({
  status: z.enum([
    "wishlist",
    "applied",
    "interview",
    "offer",
    "rejected",
  ]),
  location: z.string().optional(),
  link: z.string().url("Must be valid URL").optional().or(z.literal("")),
  source: z.string().optional(),
  salary: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof editSchema>;

// Status select için seçenekler
const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

function ApplicationEditPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id;
  const idStr =
    (Array.isArray(idParam) ? idParam[0] : idParam) as string | undefined;

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      status: "wishlist",
    },
  });

  // Uygulamayı id'den API ile çek
  useEffect(() => {
    if (!idStr) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchApp = async () => {
      try {
        const app = await applicationApiRepo.getById(idStr);

        if (cancelled) return;

        if (!app) {
          setApplication(null);
          setLoading(false);
          return;
        }

        setApplication(app);

        // Formu mevcut değerlerle doldur
        reset({
          status: app.status as FormData["status"],
          location: app.location ?? "",
          link: app.link ?? "",
          source: app.source ?? "",
          salary: app.salary ?? "",
          notes: app.notes ?? "",
        });
      } catch (err) {
        console.error("Failed to load application", err);
        if (!cancelled) {
          setApplication(null);
          setLoading(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchApp();

    return () => {
      cancelled = true;
    };
  }, [idStr, reset]);

  const onSubmit = async (data: FormData) => {
    if (!idStr) return;

    const updated: FormData = {
      ...data,
      link: data.link || undefined,
      location: data.location || undefined,
      source: data.source || undefined,
      salary: data.salary || undefined,
      notes: data.notes || undefined,
    };

    try {
      await applicationApiRepo.update(idStr, updated);
      router.push(`/applications/${idStr}`);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update application");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-sm text-slate-500">
        Loading application…
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-sm text-slate-600">
        Application not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Application
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update status, notes, and other details for this job application.
        </p>

        <p className="mt-2 text-sm text-slate-600">
          <span className="font-medium">{application.role}</span>{" "}
          <span className="text-slate-400">·</span>{" "}
          <span>{application.company}</span>
        </p>
      </div>

      {/* Kart */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="text-sm text-slate-600">
            Company and role are fixed for this application. You can adjust the
            status, link, salary, location, and notes as things progress.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 py-6 space-y-5"
        >
          {/* Company (read-only) */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Company
            </label>
            <input
              type="text"
              value={application.company}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 cursor-not-allowed"
            />
          </div>

          {/* Role (read-only) */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>
            <input
              type="text"
              value={application.role}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 cursor-not-allowed"
            />
          </div>

          {/* Location + Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                type="text"
                {...register("location")}
                placeholder="e.g. Remote, Berlin, Istanbul"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-xs text-red-600">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Link + Source */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Job post link
              </label>
              <input
                type="url"
                {...register("link")}
                placeholder="https://..."
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none
                ${errors.link ? "border-red-500" : "border-slate-300"}
                focus:ring-2 focus:ring-slate-900/10`}
              />
              {errors.link && (
                <p className="text-xs text-red-600">{errors.link.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Source
              </label>
              <input
                type="text"
                {...register("source")}
                placeholder="LinkedIn, Kariyer.net, Referral..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Salary / Range
            </label>
            <input
              type="text"
              {...register("salary")}
              placeholder="Optional (e.g. 60–80k EUR, 40k TL net)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              rows={4}
              {...register("notes")}
              placeholder="Interview notes, follow-up dates, anything important..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationEditPage;
