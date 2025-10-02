import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decryptToken } from './lib/crypto';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the request is for a protected route
    if (pathname.startsWith('/dashboard')) {
        const accessToken = request.cookies.get('access_token')?.value;
        if (!accessToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        try {
            const tokenPayload = await decryptToken(accessToken);

            if (!tokenPayload || (tokenPayload.exp && tokenPayload.exp * 1000 < Date.now())) {
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
