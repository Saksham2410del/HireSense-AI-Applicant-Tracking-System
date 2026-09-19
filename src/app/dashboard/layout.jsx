import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Sparkles, Briefcase, Users, Grid } from "@/components/icons";

const menu = [
  { href: "/dashboard", label: "Overview", icon: Grid },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users },
];

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50/50">
      <aside className="w-64 bg-white border-r border-gray-100 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">HireSense</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </div>

          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}

          <Link
            href="/dashboard/pricing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors mt-4"
          >
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-sm text-blue-600">Upgrade Plan</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 md:hidden">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-lg text-gray-900">HireSense</span>
          </Link>
          <div className="hidden md:block" />
          <UserButton afterSignOutUrl="/" />
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
