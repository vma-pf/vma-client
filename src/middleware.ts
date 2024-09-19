import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const vetPaths = ["/veterinarian"];
const farmerPaths = ["/farmer"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sessionToken")?.value;
  const role = "farmer";

  if (pathname === "/login") {
    return NextResponse.next();
  }
  if (token) {
    if (
      (role === "veterinarian" &&
        !vetPaths.some((path) => pathname.startsWith(path))) ||
      (role === "farmer" &&
        !farmerPaths.some((path) => pathname.startsWith(path)))
    ) {
      return NextResponse.redirect(new URL("/_not-found", request.url));
    }
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/register", "/veterinarian/:path*", "/farmer/:path*"],
};
