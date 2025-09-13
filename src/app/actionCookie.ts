'use server'
import { cookies } from 'next/headers'

interface CookieData {
    [key: string]: any;
}
export async function setAccessToken(access_token: string | null): Promise<void> {
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'access_token',
        value: JSON.stringify(access_token),
        secure: true,
        sameSite: 'none',
        path: '/',
        // domain: '.codeclouds.com',
        expires: thirtyDays,
        maxAge: 60 * 60 * 24 * 7
    });
}
export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    if (!access_token) return null;
    try {
        return access_token;
    } catch (e) {
        console.error('Failed to parse access_token cookie', e);
        return null;
    }
}