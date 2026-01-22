import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if we have an active session
  const { data: { session } } = await supabase.auth.getSession();

  // 1. Protect Admin Routes
  if (req.nextUrl.pathname.startsWith('/admin-dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check user role from metadata (set during manual DB entry)
    const role = session.user.user_metadata?.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/client-dashboard', req.url));
    }
  }

  // 2. Protect Client Routes
  if (req.nextUrl.pathname.startsWith('/client-dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

// Ensure middleware only runs on dashboard routes
export const config = {
  matcher: ['/admin-dashboard/:path*', '/client-dashboard/:path*'],
};