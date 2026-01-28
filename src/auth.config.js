export const authConfig = {
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in url
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = auth?.user?.role;
            const isBuyerRoute = nextUrl.pathname.startsWith('/buyer');
            const isFactoryRoute = nextUrl.pathname.startsWith('/factory');
            const isAdminRoute = nextUrl.pathname.startsWith('/admin');
            const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');

            if (isBuyerRoute || isFactoryRoute || isAdminRoute || isDashboardRoute) {
                if (isLoggedIn) {
                    if (isBuyerRoute && userRole !== 'BUYER') return false;
                    if (isFactoryRoute && userRole !== 'FACTORY') return false;
                    if (isAdminRoute && userRole !== 'ADMIN') return false;
                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role
                session.user.id = token.id
            }
            return session
        }
    },
    providers: [], // Configured in main auth.js
    session: {
        strategy: "jwt",
    },
    trustHost: true,
}
