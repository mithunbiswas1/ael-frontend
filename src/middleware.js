// src/middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Intercept /courses/learn/:id where id is numeric (e.g. /courses/learn/5)
  const learnMatch = pathname.match(/^\/courses\/learn\/(\d+)$/);
  if (learnMatch) {
    const courseId = learnMatch[1];
    try {
      const res = await fetch(`http://localhost:8005/api/v1/courses/${courseId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const slug = json?.data?.slug;
        if (slug) {
          const redirectUrl = new URL(`/courses/learn/${slug}`, request.url);
          return NextResponse.redirect(redirectUrl, 308);
        }
      }
    } catch (err) {
      console.error("[Middleware] Error resolving learn slug:", err);
    }
  }

  // 2. Intercept /courses/:id where id is numeric (e.g. /courses/5)
  const detailMatch = pathname.match(/^\/courses\/(\d+)$/);
  if (detailMatch) {
    const courseId = detailMatch[1];
    try {
      const res = await fetch(`http://localhost:8005/api/v1/courses/${courseId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const slug = json?.data?.slug;
        if (slug) {
          const redirectUrl = new URL(`/courses/${slug}`, request.url);
          return NextResponse.redirect(redirectUrl, 308);
        }
      }
    } catch (err) {
      console.error("[Middleware] Error resolving detail slug:", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/courses/learn/:path*", "/courses/:path*"],
};
