import { SignInButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  FetchUser
} from "@/lib/actions/updateUser.action";
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
  if (!user)
    return (
      <div>
        We have nothing to show you! You still didn't log in!{" "}
        <SignInButton>Sign in here</SignInButton>
      </div>
    );
  const userInfo = await FetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboard");
  return (
        <div className="flex items-center w-full p-4">
            <div className="flex-[2]"></div>
            <div className="flex-[3]">
                <div className="flex flex-col gap-2">
                    { /* <Sidebar /> */}
                    {posts.map(post => (
                        <Test3 post={post} />
                    ))}
                    {pages >1 ? <Link href={`/?page=${pages - 1}`}>Go back</Link> : <>Can't go back</>}
                    {isNext ? <Link href={`/?page=${pages + 1}`}>Go next</Link> : <>You just went through every post (;° ロ°)</>}
                </div>
            </div>
            <div className="flex-[2]"></div>
        </div>
    )
}
