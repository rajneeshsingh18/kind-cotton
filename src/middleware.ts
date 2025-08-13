// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // 1. Import NextRequest
import { auth } from '@/lib/auth';

// 2. Change the parameter type from 'Request' to 'NextRequest'
export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute) {
    // If there's no session OR the user's role is not ADMIN, redirect them
    if (!session?.user || session.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};