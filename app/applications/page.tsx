"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { applicationApiRepo } from "@/data/applicationApiRepo";
import type { JobApplication } from "@/types/application";

export default function ApplicationsPage() {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await applicationApiRepo.getAll();
        if (!cancelled) {
          setApps(data);
        }
      } catch (err) {
        console.error("GET all applications failed:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasApps = apps.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header*/}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            All the jobs you&apos;re tracking, in one clean list.
          </p>
        </div>

        <Link
          href="/applications/new"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + New Application
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-900">
              Quick Preview
            </div>
            <div className="text-xs text-slate-500">
              How your list looks
            </div>
          </div>
          <span className="text-xs text-slate-500">Today</span>
        </div>

        <div className="p-5 space-y-3">
          {loading && (
            <div className="text-sm text-slate-500">Loading applications…</div>
          )}

          {!loading && !hasApps && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              You haven't added any applications yet.
              <br />
              <Link
                href="/applications/new"
                className="mt-2 inline-flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first one →
              </Link>
            </div>
          )}

          {!loading &&
            hasApps &&
            apps.map((app) => (
              <PreviewRow
                key={app.id}
                id={app.id}
                company={app.company}
                role={app.role}
                status={app.status}
              />
            ))}

          <div className="pt-3">
            <Link
              href="/applications/new"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Add another application
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({
  id,
  company,
  role,
  status,
}: {
  id: string;
  company: string;
  role: string;
  status: JobApplication["status"];
}) {
  const { label, tone } = getStatusTone(status);

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div>
        <div className="font-medium truncate text-slate-900">
          <Link
            className="hover:underline hover:text-purple-400"
            href={`/applications/${id}`}
          >
            {company}
          </Link>
        </div>
        <div className="text-xs text-slate-600 truncate">{role}</div>
      </div>
      <span
        className={`ml-3 shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}
      >
        {label}
      </span>
    </div>
  );
}

function getStatusTone(status: JobApplication["status"]) {
  switch (status) {
    case "applied":
      return {
        label: "Applied",
        tone: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "interview":
      return {
        label: "Interview",
        tone: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "offer":
      return {
        label: "Offer",
        tone: "bg-green-50 text-green-700 border-green-200",
      };
    case "rejected":
      return {
        label: "Rejected",
        tone: "bg-red-50 text-red-700 border-red-200",
      };
    case "wishlist":
    default:
      return {
        label: "Wishlist",
        tone: "bg-slate-50 text-slate-700 border-slate-200",
      };
  }
}
