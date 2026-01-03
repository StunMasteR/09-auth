import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
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
  if (!accessToken && !refreshToken && isAuthRoute) {
    return NextResponse.next();
  } if (!accessToken && !refreshToken && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      const setCookie = response.headers['set-cookie'];
      if (!setCookie) {
        if (isPrivateRoute) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        return NextResponse.next();
      } const cookiesArray = Array.isArray(setCookie)
      ? setCookie
      : [setCookie];

    const res = NextResponse.next();

    cookiesArray.forEach(cookie => {
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

      res.cookies.set(name, value, options);
    }); return res;
  } catch {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
}  if (accessToken && isAuthRoute) {
  return NextResponse.redirect(new URL('/', request.url));
}

return NextResponse.next();
}

export const config = {
matcher: [
  '/profile/:path*',
  '/notes/:path*',
  '/sign-in',
  '/sign-up',
],
};