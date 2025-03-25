import { auth } from "@/src/lib/auth";

// Auth Js Middleware
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/task")) {
    const newUrl = new URL("/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (
    req.auth &&
    (req.nextUrl.pathname.startsWith("/signin") ||
      req.nextUrl.pathname.startsWith("/signup"))
  ) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/signin", "/signup", "/", "/task/:path*"],
};
