"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { applicationApiRepo } from "@/data/applicationApiRepo";
import type { JobApplication } from "@/types/application";

function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const idParam = (params as any).id;
  const idStr =
    (Array.isArray(idParam) ? idParam[0] : idParam) as string | undefined;

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idStr) {
      setApplication(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      const app = await applicationApiRepo.getById(idStr);

      if (!cancelled) {
        setApplication(app);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [idStr]);

  const handleDelete = async () => {
    if (!idStr) return;
    const ok = confirm("Will you delete ?");
    if (!ok) return;

    await applicationApiRepo.delete(idStr);
    router.push("/applications");
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto h-[85vh] flex justify-center items-center text-sm text-slate-500">
        Loading application…
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-3xl mx-auto h-[85vh] flex flex-col justify-center items-center text-sm text-slate-600">
        <p>Application not found.</p>
        <button
          onClick={() => router.push("/applications")}
          className="mt-3 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  // 🔥 Buradan sonrası senin eski UI'nin API versiyonu
  return (
    <div className="max-w-3xl mx-auto h-[85vh] flex justify-center items-center">
      <div className="w-full rounded-2xl px-4 py-4 shadow-xs shadow-slate-300 border-slate-200 border bg-white">
        {/* Üst kısım: back, edit, delete, başlık */}
        <div className="border-b relative pb-4">
          <button
            onClick={() => router.push("/applications")}
            className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-300 cursor-pointer"
          >
            ← Back to Applications
          </button>

          <button
            onClick={handleDelete}
            className="absolute right-0 top-0 mt-1 mx-2 bg-red-500 px-2 py-1 rounded-xl text-xs font-bold text-white cursor-pointer"
          >
            Delete
          </button>

          <button
            onClick={() => router.push(`/applications/${idStr}/edit`)}
            className="absolute right-20 top-0 mt-1 mx-2 bg-blue-500 px-4 py-1 rounded-xl text-xs font-bold text-white cursor-pointer"
          >
            Edit
          </button>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            {application.role}
          </h1>
          <h2 className="text-xl text-slate-600">{application.company}</h2>

          <p className="my-1 text-sm text-slate-500">
            Created at: {application.createdAt}
            <br />
            Updated at: {application.updatedAt}
          </p>

          <span className="absolute right-0 bottom-2 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium shadow-sm transition-all hover:scale-[1.02] hover:shadow-sm cursor-default">
            {application.status}
          </span>
        </div>

        {/* Detay alanları */}
        <div className="mt-4 space-y-4 text-sm">
          {/* Salary */}
          {application.salary && (
            <div>
              <div className="text-xs text-slate-500">Salary</div>
              <div className="mt-1 font-medium text-slate-800">
                {application.salary}
              </div>
            </div>
          )}

          {/* Link */}
          {application.link && (
            <div>
              <div className="text-xs text-slate-500">Job Link</div>
              <a
                href={application.link}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
              >
                {application.link}
              </a>
            </div>
          )}

          {/* Source */}
          {application.source && (
            <div>
              <div className="text-xs text-slate-500">Source</div>
              <div className="mt-1 font-medium text-slate-800">
                {application.source}
              </div>
            </div>
          )}

          {/* Location */}
          {application.location && (
            <div>
              <div className="text-xs text-slate-500">Location</div>
              <div className="mt-1 font-medium text-slate-800">
                {application.location}
              </div>
            </div>
          )}

          {/* Notes */}
          {application.notes ? (
            <div>
              <div className="text-sm font-semibold text-slate-700">Notes</div>
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                {application.notes}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-sm font-semibold text-slate-700">Notes</div>
              <p className="mt-2 text-sm text-slate-400 italic">
                No notes yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailPage;
