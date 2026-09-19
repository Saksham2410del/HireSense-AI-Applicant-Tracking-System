import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { timeAgo } from "@/lib/utils";
import { Plus, Building, MapPin, Calendar, ArrowRight } from "@/components/icons";

export default async function JobsPage() {
  const { userId } = await auth();

  const jobs = await prisma.job.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Active Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your open positions and candidates.</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs created yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
            You have not posted any jobs yet. Create your first job posting to start
            analyzing resumes with AI.
          </p>
          <Link
            href="/dashboard/jobs/new"
            className="inline-block bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm rounded-lg px-4 py-2 text-sm font-medium"
          >
            Create your first job
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 group p-6 flex flex-col h-full cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {job.title}
                  </h2>
                  <div className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                    Active
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="line-clamp-1">{job.company}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="line-clamp-1">{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{timeAgo(job.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center">
                    View Candidates
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
