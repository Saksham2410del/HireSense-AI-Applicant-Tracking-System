import Link from "next/link";
import { createJob } from "@/app/actions/jobActions";

const fields = [
  { name: "title", label: "Job Title", placeholder: "e.g. Senior Frontend Developer" },
  { name: "company", label: "Company Name", placeholder: "e.g. TechCorp Inc." },
  { name: "location", label: "Location", placeholder: "e.g. Remote, San Francisco, CA" },
];

const inputClass =
  "w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";

export default function CreateJobPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Job</h1>
        <Link href="/dashboard/jobs" className="text-slate-500 hover:text-slate-900 font-medium">
          Cancel
        </Link>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <form action={createJob} className="space-y-6">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 mb-2">
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                required
                placeholder={field.placeholder}
                className={inputClass}
              />
            </div>
          ))}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              placeholder="Describe the responsibilities, requirements, and benefits..."
              className={inputClass}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            Create Job Listing
          </button>
        </form>
      </div>
    </div>
  );
}
