import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;

  if (url.pathname.startsWith('/profile')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (url.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (url.pathname.startsWith('/shelter/dashboard')) {
    if (!token || token.role !== 'SHELTER') {
      return NextResponse.redirect(new URL('/shelter/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*', '/shelter/dashboard/:path*'],
};
