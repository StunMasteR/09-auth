import { NextRequest, NextResponse } from 'next/server';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthenticated =
    request.cookies.has('accessToken') ||
        request.cookies.has('refreshToken');
        if (isPrivateRoute && !isAuthenticated) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
          }
          if (isAuthRoute && isAuthenticated) {
            return NextResponse.redirect(new URL('/profile', request.url));
          }
        
          return NextResponse.next();
        } 
    