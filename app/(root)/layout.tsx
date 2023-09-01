import { ClerkProvider } from "@clerk/nextjs"
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
export const metadata = {
    title: 'Craned',
    description: 'Wat'
}

export default function RootLayout({
    children
}: { children: React.ReactNode }) {
    return (<ClerkProvider>
        <div>
            <SignedIn>
                    <div>Navbar</div> <div><UserButton afterSignOutUrl="/" /></div>
            </SignedIn>
            <SignedOut>
                <SignInButton>
                    Sign In
                </SignInButton>
            </SignedOut>
        </div>
        {children}
    </ClerkProvider>)
}
