import { ClerkProvider, SignOutButton, currentUser } from "@clerk/nextjs"
import Image from "next/image";
import { FetchUser } from "@/lib/actions/updateUser.action";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import ActiveLink from "@/stories/usedLinks";
export const metadata = {
    title: 'Craned',
    description: 'Wat'
}

export default async function RootLayout({
    children
}: { children: React.ReactNode }) {
    const user = await currentUser();
    if (!user) return <ClerkProvider><div>
        Hi!
        {children}
    </div>
    </ClerkProvider>;
    const userInfo = await FetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboard");
    return (<ClerkProvider>
        <div>
            <SignedIn>
                <Link href="/">Craned</Link><ActiveLink href="/new">New Post</ActiveLink> <div><Image alt="Profile Picture" width={120} height={120} src={userInfo.image} />{userInfo.name} ({userInfo.username})</div>
                <SignOutButton>
                    Sign out
                </SignOutButton>
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
