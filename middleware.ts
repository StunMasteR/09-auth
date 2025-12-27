import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const PRIVATE_ROUTES = ["/profile", "/dashboard"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  const pathname = req.nextUrl.pathname;


  if (!accessToken && refreshToken) {
    try {
      const data = await checkSession(refreshToken);

      const res = NextResponse.next();

      res.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        path: "/",
      });

      res.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        path: "/",
      });

      return res;
    } catch {
      // refreshToken невалідний → користувач не авторизований
      isAuthenticated = false;
    }
  }


  if (!isAuthenticated && PRIVATE_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }


  if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
