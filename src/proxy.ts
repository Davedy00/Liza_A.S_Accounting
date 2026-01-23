import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // 1. Protect Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin-dashboard')) {
    if (!session || session.user.user_metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/authentication-screen', request.url));
    }
  }

  // 2. Protect Client Routes
  if (request.nextUrl.pathname.startsWith('/client-dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/authentication-screen', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin-dashboard/:path*', '/client-dashboard/:path*'],
};
