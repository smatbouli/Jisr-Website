import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const userRole = req.auth?.user?.role;

    const isBuyerRoute = nextUrl.pathname.startsWith('/buyer');
    const isFactoryRoute = nextUrl.pathname.startsWith('/factory');
    const isAdminRoute = nextUrl.pathname.startsWith('/admin');
    const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');

    // 1. Redirect unauthenticated users
    if ((isBuyerRoute || isFactoryRoute || isAdminRoute || isDashboardRoute) && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    // 2. Role-based protection
    if (isLoggedIn) {
        if (isBuyerRoute && userRole !== 'BUYER') {
            return NextResponse.redirect(new URL('/', nextUrl)); // Or distinct error page
        }
        if (isFactoryRoute && userRole !== 'FACTORY') {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
        if (isAdminRoute && userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
