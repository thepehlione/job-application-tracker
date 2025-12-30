import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-slate-900 text-white grid place-items-center font-bold">
              JT
            </div>
            <div>
              <div className="font-semibold leading-tight">JobTracker</div>
              <div className="text-xs text-slate-500 -mt-0.5">
                Personal job application workspace
              </div>
            </div>
          </div>

          <Link
            href="/applications"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            View Applications
            <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Track. Update. Follow up.
            </p>

            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight">
              Keep your job applications organized in one place.
            </h1>

            <p className="mt-3 text-slate-600 leading-relaxed">
              Add applications, track statuses, save important links, and keep notes without
              losing context.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/applications/new"
                className="inline-flex justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
              >
                + New Application
              </Link>

              <Link
                href="/applications"
                className="inline-flex justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
              >
                Browse list
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Total" value="—" />
              <StatCard label="Applied" value="—" />
              <StatCard label="Interview" value="—" />
              <StatCard label="Offer" value="—" />
            </div>

           
          </div>

          {/* Preview panel */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-medium">Quick Preview</div>
                <div className="text-xs text-slate-500">How your list will look</div>
              </div>
              <span className="text-xs text-slate-500">Today</span>
            </div>

            <div className="p-5 space-y-3">
              <PreviewRow
                company="Acme Inc."
                role="Frontend Developer"
                status="Applied"
                statusTone="blue"
              />
              <PreviewRow
                company="Nimbus Labs"
                role="Next.js Engineer"
                status="Interview"
                statusTone="amber"
              />
              <PreviewRow
                company="Orion Studio"
                role="Full-stack Developer"
                status="Rejected"
                statusTone="red"
              />
              <PreviewRow
                company="Zenith Corp."
                role="Software Engineer"
                status="Offer"
                statusTone="green"
              />

              <div className="pt-3">
                <Link
                  href="/applications"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Go to applications
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function PreviewRow({
  company,
  role,
  status,
  statusTone,
}: {
  company: string;
  role: string;
  status: string;
  statusTone: "blue" | "amber" | "green" | "red";
}) {
  const tone =
    statusTone === "blue"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : statusTone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : statusTone === "green"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="min-w-0">
        <div className="font-medium truncate">{company}</div>
        <div className="text-xs text-slate-600 truncate">{role}</div>
      </div>
      <span
        className={`ml-3 shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}
      >
        {status}
      </span>
    </div>
  );
}
