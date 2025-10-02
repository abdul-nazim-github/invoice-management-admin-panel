'use client'
import { useAuthContext } from '@/context/AuthContext';
import { ReactNode } from 'react';


const Spinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
);


export function RootProvider({ children }: { children: ReactNode }) {
    const { loading } = useAuthContext();

    if (loading) {
        return <Spinner />;
    }

    return <>{children}</>;
}