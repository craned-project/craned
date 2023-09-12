import { SignInButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FetchUser, getRecommendedPosts } from "@/lib/actions/updateUser.action";

export default async function Home() {
const user = await currentUser();
    if (!user) return <div>
        We have nothing to show you! You still didn't log in! <SignInButton>
            Sign in here
        </SignInButton>
    </div>;
    const userInfo = await FetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboard");
    const recommended = await getRecommendedPosts(user.id)
    console.log(recommended)
    return (
        <div className="flex">
        { /* <Sidebar /> */ }
            <h1 className="text-3xl">Home</h1>
        </div>
    )
}
