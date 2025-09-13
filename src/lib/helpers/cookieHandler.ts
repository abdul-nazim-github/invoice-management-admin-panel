'use server'
import { cookies } from 'next/headers'

export async function setAccessToken(access_token: string): Promise<void> {    
    const cookieStore = await cookies();
     cookieStore.set({
            name: 'access_token',
            value: access_token,
            secure: true,
            sameSite: 'none',
            path: '/',
            // domain: '.codeclouds.com',
            maxAge: 60 * 60 * 24 * 7
        });
}
export async function getAcessToken(): Promise<string | null> {
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
export async function deleteAccessToken() {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
}