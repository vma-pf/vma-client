import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = [
  "/dashboard",
  "/pig",
  "/medicine",
  "/vaccination",
  "/treatment-plan",
  "/camera",
  "/alert",
];
const publicPaths = ["/login", "/register"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sessionToken")?.value;

  if (privatePaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard",
    "/pig",
    "/medicine",
    "/vaccination",
    "/treatment-plan",
    "/camera",
    "/alert",
    "/login",
    "/register",
  ],
};
