import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE, decodeToken } from "./lib/utils";

const vetPaths = ["/veterinarian"];
const farmerPaths = ["/farmer"];
const farmerAssistantPaths = ["/farm-assist"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("sessionToken")?.value;
  const decodedToken = decodeToken(token as string) || {};
  const role: string = decodedToken?.role?.toLowerCase() || "";

  if (pathname === "/login") {
    return NextResponse.next();
  }
  if (token) {
    if (
      (role === ROLE.VETERINARIAN &&
        !vetPaths.some((path) => pathname.startsWith(path))) ||
      (role === ROLE.FARMER &&
        !farmerPaths.some((path) => pathname.startsWith(path))) ||
      (role === ROLE.FARMERASSISTANT &&
        !farmerAssistantPaths.some((path) => pathname.startsWith(path)))
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
  matcher: ["/login", "/register", "/veterinarian/:path*", "/farmer/:path*", "/farm-assist/:path*"],
};
