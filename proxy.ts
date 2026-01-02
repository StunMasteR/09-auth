import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );
  if (!accessToken && !refreshToken && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  } if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      const setCookie = response.headers['set-cookie'];
      if (!setCookie) {
        if (isPrivateRoute) {
          return NextResponse.redirect(
            new URL('/sign-in', request.url)
          );
        }
        return NextResponse.next();
      } setCookie.forEach(cookie => {
        const [pair, ...rest] = cookie.split(';');
        const [name, value] = pair.split('=');

        const options: {
          path?: string;
          expires?: Date;
          maxAge?: number;
        } = {};

        rest.forEach(part => {
          const [key, val] = part.trim().split('=');

          if (key.toLowerCase() === 'path') options.path = val;
          if (key.toLowerCase() === 'max-age')
            options.maxAge = Number(val);
          if (key.toLowerCase() === 'expires')
            options.expires = new Date(val);
        });

        cookieStore.set(name, value, options);
      });
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  } if ((accessToken || refreshToken) && isAuthRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};