import { SignInButton, SignedIn, SignedOut, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FetchUser } from "@/lib/actions/updateUser.action";
import { fetchPosts } from "@/lib/actions/newPost.action";
import Test3 from "@/stories/Post3Wow";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const pages = searchParams.page ? +searchParams.page : 1;
  const { posts, isNext } = await fetchPosts(pages);
  return (
    <div className="flex items-center w-full p-4">
      <SignedOut>
        <div>
          We have nothing to show you! You still didn't log in!{" "}
          <SignInButton>Sign in here</SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex-[2]"></div>
        <div className="flex-[5]">
          <div className="flex flex-col gap-2">
            {/* <Sidebar /> */}
            {posts.map((post) => (
              <Test3 post={post}/>
            ))}
            <div className="flex justify-between w-full">
              {pages > 1 ? (
                <Link href={`/?page=${pages - 1}`} className="bg-sec hover:bg-pri hover:text-black font-bold rounded-xl p-1">Go back</Link>
              ) : (
                <div className="flex justify-center text-lg text-tri"></div>
              )}
              {isNext ? (
                <Link href={`/?page=${pages + 1}`} className="bg-sec hover:bg-pri hover:text-black font-bold rounded-xl p-1">Go next</Link>
              ) : (
                <div className="flex justify-center text-lg text-tri"></div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-[2]"></div>
      </SignedIn>
    </div>
  );
}
