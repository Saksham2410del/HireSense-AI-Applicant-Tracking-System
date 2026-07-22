import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import UploadResumeForm from "./UploadResumeForm";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  User,
  Mail,
  Sparkles,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@clerk/nextjs/server";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return notFound();

  const resolvedParams = await params;
  const job = await prisma.job.findUnique({
    where: { id: resolvedParams.id, clerkUserId: userId },
    include: {
      candidates: {
        orderBy: { matchScore: "desc" },
      },
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Job Info & Candidates) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Header Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Posted{" "}
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-100">
                Active
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                Job Description
              </h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">
                {job.description}
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Candidates{" "}
                <span className="text-gray-400 ml-1 text-base font-normal">
                  ({job.candidates.length})
                </span>
              </h2>
            </div>

            {job.candidates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                <UsersIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-900 font-medium">No candidates yet</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Upload a resume on the right to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {job.candidates.map((candidate) => {
                  let analysis: any = null;
                  try {
                    // Try to parse the advanced JSON string
                    analysis = JSON.parse(candidate.feedback || "{}");
                  } catch (e) {
                    // Fallback for old string format
                    analysis = { summary: candidate.feedback };
                  }

                  return (
                    <div
                      key={candidate.id}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            {candidate.name}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="w-3.5 h-3.5 mr-1" />
                            {candidate.email}
                          </p>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-full font-bold flex items-center gap-1.5 shadow-sm border ${
                            candidate.matchScore && candidate.matchScore >= 80
                              ? "bg-green-50 text-green-700 border-green-200"
                              : candidate.matchScore &&
                                  candidate.matchScore >= 50
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          {candidate.matchScore}% Match
                        </div>
                      </div>

                      {analysis?.summary && (
                        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50 mt-2">
                          <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                            Executive Summary
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {analysis.summary}
                          </p>
                        </div>
                      )}

                      {/* Advanced AI Data */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {analysis?.strengths?.length > 0 && (
                          <div className="bg-green-50/30 rounded-xl p-4 border border-green-100">
                            <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">
                              Key Strengths
                            </div>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {analysis.strengths.map(
                                (s: string, i: number) => (
                                  <li key={i}>{s}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                        {analysis?.weaknesses?.length > 0 && (
                          <div className="bg-orange-50/30 rounded-xl p-4 border border-orange-100">
                            <div className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">
                              Missing Requirements
                            </div>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {analysis.weaknesses.map(
                                (w: string, i: number) => (
                                  <li key={i}>{w}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                        {(analysis?.jargon?.length > 0 ||
                          analysis?.flags?.length > 0) && (
                          <div className="md:col-span-2 bg-red-50/30 rounded-xl p-4 border border-red-100 flex flex-col sm:flex-row gap-6">
                            {analysis?.flags?.length > 0 && (
                              <div className="flex-1">
                                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                                  Red Flags & Grammar
                                </div>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                  {analysis.flags.map(
                                    (f: string, i: number) => (
                                      <li key={i}>{f}</li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                            {analysis?.jargon?.length > 0 && (
                              <div className="flex-1">
                                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                                  Excessive Jargon
                                </div>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                  {analysis.jargon.map(
                                    (j: string, i: number) => (
                                      <li key={i}>{j}</li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Upload Form) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <UploadResumeForm jobId={job.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
