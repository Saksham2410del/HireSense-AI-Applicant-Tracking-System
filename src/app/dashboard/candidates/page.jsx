import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { timeAgo, scoreColor } from "@/lib/utils";
import { Users, Mail, Sparkles, Building } from "@/components/icons";

export default async function CandidatesPage() {
  const { userId } = await auth();

  const candidates = await prisma.candidate.findMany({
    where: { job: { clerkUserId: userId } },
    orderBy: { createdAt: "desc" },
    include: { job: true },
  });

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">All Candidates</h1>
        <p className="text-sm text-gray-500 mt-1">
          A global view of everyone who has applied across all your job postings.
        </p>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
            You have not uploaded any resumes yet. Go to a specific job to upload and analyze
            your first candidate.
          </p>
          <Link
            href="/dashboard/jobs"
            className="inline-block bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm rounded-lg px-4 py-2 text-sm font-medium"
          >
            View Jobs
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Applied For</th>
                  <th className="px-6 py-4">AI Score</th>
                  <th className="px-6 py-4 text-right">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{candidate.name}</div>
                      <div className="flex items-center text-gray-500 mt-1 text-xs">
                        <Mail className="w-3.5 h-3.5 mr-1" />
                        {candidate.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/jobs/${candidate.job.id}`} className="hover:text-blue-600 transition-colors">
                        <div className="font-medium text-gray-900">{candidate.job.title}</div>
                        <div className="flex items-center text-gray-500 mt-1 text-xs">
                          <Building className="w-3.5 h-3.5 mr-1" />
                          {candidate.job.company}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs border ${scoreColor(candidate.matchScore)}`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {candidate.matchScore}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {timeAgo(candidate.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
