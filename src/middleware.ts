import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const { userId } = await auth();

  // Защищаем /dashboard маршрут
  if (pathname.startsWith("/dashboard")) {
    if (!userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Перенаправляем залогиненных пользователей с главной страницы на dashboard
  if (pathname === "/" && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
