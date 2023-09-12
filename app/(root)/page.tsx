import { SignInButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FetchUser, getRecommendedPosts } from "@/lib/actions/updateUser.action";
import { fetchPosts } from "@/lib/actions/newPost.action";
import Test3 from "@/stories/Post3Wow";
import Link from "next/link";

export default async function Home({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const user = await currentUser();
    const pages = searchParams.page ? +searchParams.page : 1;
    const { posts, isNext } = await fetchPosts(pages);
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
        <div className="flex flex-col">
            { /* <Sidebar /> */}
            <h1 className="text-3xl">Home</h1>
            {posts.map(post => (
                <Test3 post={post} havelinkascomment={true} />
            ))}
            {pages >1 ? <Link href={`/?page=${pages - 1}`}>Go back</Link> : <>Can't go back</>}
            {isNext ? <Link href={`/?page=${pages + 1}`}>Go next</Link> : <>You just went through every post (;° ロ°)</>}
        </div>
    )
}
