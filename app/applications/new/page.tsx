"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApplicationStatus, JobApplication } from "@/types/application";
import { useRouter } from "next/navigation";
import { applicationApiRepo } from "@/data/applicationApiRepo";

const schema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  status: z.enum(["wishlist", "applied", "interview", "offer", "rejected"]),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  source: z.string().optional(),
  salary: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

function AddNewApplication() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "wishlist",
    },
  });

  const onSubmit = async (data: FormData) => {
    
    const cleaned: Omit<JobApplication, "id" | "createdAt" | "updatedAt"> = {
      company: data.company,
      role: data.role,
      status: data.status,
      location: data.location || undefined,
      link: data.link || undefined,
      source: data.source || undefined,
      salary: data.salary || undefined,
      notes: data.notes || undefined,
    };

    try {
      const created = await applicationApiRepo.create(cleaned);

      router.push(`/applications/${created.id}`);
    } catch (err) {
      console.error("Create failed", err);
      alert("Failed to save application");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Add New Job Application
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Save a new job you applied (or plan to apply) and keep all details in
          one place.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="text-sm text-slate-600">
            Fill in the company, role, and current status. Optional fields help
            you remember where you found the job, salary range, and extra notes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 py-6 space-y-5"
        >
          {/* Company */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("company")}
              placeholder="e.g. Google"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none
                  ${errors.company ? "border-red-500" : "border-slate-300"}
                  focus:ring-2 focus:ring-slate-900/10`}
            />
            {errors.company && (
              <p className="text-xs text-red-600">
                {errors.company.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("role")}
              placeholder="e.g. Frontend Developer"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none
                  ${errors.role ? "border-red-500" : "border-slate-300"}
                  focus:ring-2 focus:ring-slate-900/10`}
            />
            {errors.role && (
              <p className="text-xs text-red-600">{errors.role.message}</p>
            )}
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
              placeholder="Anything to remember about this company, interview tips, deadlines..."
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
              {isSubmitting ? "Saving..." : "Save application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewApplication;
