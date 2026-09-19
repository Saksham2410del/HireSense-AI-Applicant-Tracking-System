import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Sparkles, ArrowRight, Briefcase, FileCheck } from "@/components/icons";

const features = [
  {
    title: "Create Jobs",
    text: "Easily set up job descriptions and requirements. Our system prepares the AI to look for exactly what you need.",
    icon: Briefcase,
    box: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Upload Resumes",
    text: "Drop in PDF resumes. Our platform instantly parses and reads the data without you lifting a finger.",
    icon: FileCheck,
    box: "bg-indigo-100",
    color: "text-indigo-600",
  },
  {
    title: "AI Analysis",
    text: "Gemini AI reviews the resume against the job description and generates a precise match score and feedback.",
    icon: Sparkles,
    box: "bg-purple-100",
    color: "text-purple-600",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">HireSense</span>
        </div>

        <nav className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100">
              Dashboard
            </Link>
          </SignedIn>
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full px-6 py-2">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Recruiting is Here</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mb-6 leading-tight">
          Find the perfect candidate in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            seconds, not hours.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          HireSense uses advanced AI to analyze resumes, compare them against your job
          descriptions, and score candidates instantly. Say goodbye to manual screening.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 px-8 text-base font-medium shadow-lg shadow-blue-200 transition-all hover:scale-105"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>

        <div className="grid sm:grid-cols-3 gap-8 mt-24 max-w-5xl text-left">
          {features.map((item) => (
            <div key={item.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className={`${item.box} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
