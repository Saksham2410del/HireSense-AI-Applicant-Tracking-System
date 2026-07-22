"use client";

import { useState } from "react";
import { uploadAndAnalyzeResume } from "@/app/actions/aiActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

export default function UploadResumeForm({ jobId }: { jobId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setIsUploading(true);
    setError("");
    setSuccess(false);
    try {
      formData.append("jobId", jobId);
      await uploadAndAnalyzeResume(formData);
      setSuccess(true);
      // Reset form
      const form = document.getElementById("upload-form") as HTMLFormElement;
      if (form) form.reset();
    } catch (e: any) {
      setError(e.message || "Failed to upload and analyze");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 p-2 rounded-lg">
          <UploadCloud className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Add Candidate</h2>
          <p className="text-xs text-gray-500">
            AI will automatically analyze the resume.
          </p>
        </div>
      </div>

      <form id="upload-form" action={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="name"
            className="text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. John Doe"
            required
            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <Label
            htmlFor="resume"
            className="text-xs font-semibold text-gray-600 uppercase tracking-wider"
          >
            Resume (PDF)
          </Label>
          <Input
            id="resume"
            name="resume"
            type="file"
            accept="application/pdf"
            required
            className="file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-semibold hover:file:bg-blue-100 cursor-pointer bg-gray-50/50 border-gray-200"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex flex-col gap-2">
            <div>{error.replace("UPGRADE_REQUIRED:", "")}</div>
            {error.includes("UPGRADE_REQUIRED") && (
              <a
                href="/dashboard/pricing"
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-center hover:bg-red-700 transition-colors mt-1"
              >
                View Upgrade Plans
              </a>
            )}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Analyzed successfully!
          </div>
        )}

        <Button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 mt-4"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            "Upload & Analyze"
          )}
        </Button>
      </form>
    </div>
  );
}
