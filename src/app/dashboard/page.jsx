import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { scanLimits } from "@/lib/plans";

export default async function DashboardOverview() {
  const { userId } = await auth();

  const jobCount = await prisma.job.count({
    where: { clerkUserId: userId },
  });

  const candidateCount = await prisma.candidate.count({
    where: { job: { clerkUserId: userId } },
  });

  const subscription = await prisma.userSubscription.findUnique({
    where: { clerkUserId: userId },
  });

  const plan = subscription ? subscription.plan : "FREE";
  const used = subscription ? subscription.scanCount : 0;
  const scansLeft = scanLimits[plan] - used;

  const stats = [
    { label: "Active Jobs", value: jobCount, blue: false },
    { label: "Total Candidates Scanned", value: candidateCount, blue: false },
    { label: `Scans Left (${plan} plan)`, value: scansLeft, blue: true },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
      <p className="text-slate-600">
        Welcome to HireSense. Here is a summary of your active jobs and candidates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
            <p className={`text-3xl font-bold mt-2 ${stat.blue ? "text-blue-600" : "text-slate-900"}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
