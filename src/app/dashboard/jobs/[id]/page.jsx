import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { timeAgo, scoreColor } from "@/lib/utils";
import UploadResumeForm from "./UploadResumeForm";
import { ArrowLeft, Building, MapPin, Clock, Mail, Sparkles, Users } from "@/components/icons";

function ListBox({ title, items, box, text }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`rounded-xl p-4 border ${box}`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${text}`}>{title}</div>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function readFeedback(candidate) {
  try {
    return JSON.parse(candidate.feedback || "{}");
  } catch (err) {
    return { summary: candidate.feedback };
  }
}

export default async function JobDetailsPage({ params }) {
  const { userId } = await auth();
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id, clerkUserId: userId },
    include: { candidates: { orderBy: { matchScore: "desc" } } },
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-gray-400" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Posted {timeAgo(job.createdAt)}
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

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Candidates
              <span className="text-gray-400 ml-2 text-base font-normal">
                ({job.candidates.length})
              </span>
            </h2>

            {job.candidates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-900 font-medium">No candidates yet</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Upload a resume on the right to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {job.candidates.map((candidate) => {
                  const analysis = readFeedback(candidate);

                  return (
                    <div
                      key={candidate.id}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="w-3.5 h-3.5 mr-1" />
                            {candidate.email}
                          </p>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-full font-bold flex items-center gap-1.5 shadow-sm border ${scoreColor(candidate.matchScore)}`}
                        >
                          <Sparkles className="w-4 h-4" />
                          {candidate.matchScore}% Match
                        </div>
                      </div>

                      {analysis.summary && (
                        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50">
                          <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
                            Executive Summary
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ListBox
                          title="Key Strengths"
                          items={analysis.strengths}
                          box="bg-green-50/30 border-green-100"
                          text="text-green-700"
                        />
                        <ListBox
                          title="Missing Requirements"
                          items={analysis.weaknesses}
                          box="bg-orange-50/30 border-orange-100"
                          text="text-orange-700"
                        />
                        <ListBox
                          title="Red Flags & Grammar"
                          items={analysis.flags}
                          box="bg-red-50/30 border-red-100"
                          text="text-red-700"
                        />
                        <ListBox
                          title="Excessive Jargon"
                          items={analysis.jargon}
                          box="bg-red-50/30 border-red-100"
                          text="text-red-700"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <UploadResumeForm jobId={job.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
