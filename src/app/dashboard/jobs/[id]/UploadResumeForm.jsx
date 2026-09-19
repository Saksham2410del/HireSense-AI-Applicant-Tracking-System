"use client";

import { useState } from "react";
import { uploadAndAnalyzeResume } from "@/app/actions/aiActions";
import { UploadCloud, CheckCircle, Spinner } from "@/components/icons";

const inputClass =
  "w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none transition-colors";

const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5";

export default function UploadResumeForm({ jobId }) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData) {
    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      formData.append("jobId", jobId);
      await uploadAndAnalyzeResume(formData);
      setSuccess(true);
      document.getElementById("upload-form").reset();
    } catch (err) {
      setError(err.message || "Failed to upload and analyze");
    }

    setUploading(false);
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 p-2 rounded-lg">
          <UploadCloud className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Add Candidate</h2>
          <p className="text-xs text-gray-500">AI will automatically analyze the resume.</p>
        </div>
      </div>

      <form id="upload-form" action={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Full Name</label>
          <input id="name" name="name" required placeholder="e.g. John Doe" className={inputClass} />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email Address</label>
          <input id="email" name="email" type="email" required placeholder="john@example.com" className={inputClass} />
        </div>

        <div className="pt-2">
          <label htmlFor="resume" className={labelClass}>Resume (PDF)</label>
          <input
            id="resume"
            name="resume"
            type="file"
            accept="application/pdf"
            required
            className={`${inputClass} cursor-pointer file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-semibold hover:file:bg-blue-100`}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex flex-col gap-2">
            <div>{error.replace("UPGRADE_REQUIRED:", "")}</div>
            {error.includes("UPGRADE_REQUIRED") && (
              <a
                href="/dashboard/pricing"
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-center hover:bg-red-700 transition-colors"
              >
                View Upgrade Plans
              </a>
            )}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Analyzed successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-xl h-11 mt-4"
        >
          {uploading ? (
            <>
              <Spinner className="w-4 h-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            "Upload & Analyze"
          )}
        </button>
      </form>
    </div>
  );
}
