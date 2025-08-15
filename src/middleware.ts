import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const { userId } = await auth();

  // Защищаем защищенные маршруты
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/decks") ||
    pathname.startsWith("/study")
  ) {
    if (!userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Если пользователь залогинен и находится на главной странице, перенаправляем на dashboard
  if (pathname === "/" && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
