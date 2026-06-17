import type {
    Metadata,
} from 'next';

import './globals.css'
import AuthSessionProvider from '@/components/AuthSessionProvider';

export const metadata: Metadata = {
    title: "Fix-it-Please"
}
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className='min-h-screen w-full'>
                <AuthSessionProvider>
                    {children}
                </AuthSessionProvider>
            </body>
        </html>
    );
}