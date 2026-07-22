import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Briefcase, Users, LayoutDashboard, Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">
              HireSense
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Overview</span>
          </Link>
          <Link
            href="/dashboard/jobs"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Briefcase className="w-5 h-5" />
            <span className="font-medium text-sm">Jobs</span>
          </Link>
          <Link
            href="/dashboard/candidates"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium text-sm">Candidates</span>
          </Link>
          <Link
            href="/dashboard/pricing"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors mt-4"
          >
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-sm text-blue-600">
              Upgrade Plan
            </span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-lg text-gray-900">HireSense</span>
            </Link>
          </div>
          <div className="hidden md:block" /> {/* Spacer */}
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
