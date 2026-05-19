import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Create an admin client to completely bypass RLS when checking profiles
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    if (!user) {
      // no user, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    
    // Check if user is active staff
    const { data: profile } = await supabaseAdmin
      .from("staff_profiles")
      .select("is_active")
      .eq("id", user.id)
      .single();
      
    if (!profile || profile.is_active === false) {
      // Restricted!
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "Access Restricted");
      return NextResponse.redirect(url);
    }
  }

  // If user is already logged in, redirect them away from /admin/login
  if (request.nextUrl.pathname.startsWith("/admin/login") && user) {
    const { data: profile } = await supabaseAdmin
      .from("staff_profiles")
      .select("is_active")
      .eq("id", user.id)
      .single();
      
    if (profile && profile.is_active !== false) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    } else {
      // If they are logged in but restricted/no profile, we shouldn't trap them in a loop.
      // Let them stay on the login page (or we can just let them see the error).
      // They can try logging in with a different account.
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
