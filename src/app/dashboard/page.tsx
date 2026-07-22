import prisma from "@/lib/prisma";

export default async function DashboardOverview() {
  const activeJobsCount = await prisma.job.count();
  const candidatesCount = await prisma.candidate.count();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
      <p className="text-slate-600">
        Welcome to HireSense. Here is a summary of your active jobs and
        candidates.
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Stat Card 1 */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Active Jobs</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {activeJobsCount}
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Total Candidates Scanned
          </h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {candidatesCount}
          </p>
        </div>

        {/* Stat Card 3 */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">
            Available Scans (Stripe limits)
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">20</p>
        </div>
      </div>
    </div>
  );
}
