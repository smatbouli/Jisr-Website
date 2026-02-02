import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ['/((?!api/diagnostics|diagnostics|simple|admin|dashboard|buyer|factory|api|_next/static|_next/image|favicon.ico).*)'],
};
