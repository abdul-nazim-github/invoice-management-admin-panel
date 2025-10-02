import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decryptToken } from './lib/crypto';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('access_token')?.value;

    // If the user is trying to access the login page but is already logged in, redirect to dashboard
    if (pathname === '/' && accessToken) {
        try {
            const tokenPayload = await decryptToken(accessToken);
            if (tokenPayload && (tokenPayload.exp as number) * 1000 > Date.now()) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        } catch (error) {
            // If token is invalid, let them proceed to the login page
        }
    }

    // Check if the request is for a protected route
    if (pathname.startsWith('/dashboard')) {
        if (!accessToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        try {
            const tokenPayload = await decryptToken(accessToken);

            if (!tokenPayload || (tokenPayload.exp && (tokenPayload.exp as number) * 1000 < Date.now())) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/'],
}
