import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the routes that anyone can access without logging in
const isPublicRoute = createRouteMatcher(["/", "/pricing"]);

export default clerkMiddleware(async (auth, request) => {
  // If the route is not public, protect it! (This will redirect to login)
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes and Clerk endpoints
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
