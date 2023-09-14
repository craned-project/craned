import {
  FetchPostOfUser,
  FetchUserWithTheirHeadsOff,
} from "@/lib/actions/updateUser.action";
import Post from "@/lib/models/post.model";
import User from "@/lib/models/user.model";
import Test3 from "@/stories/Post3Wow";
import Image from "next/image";
export default async function users({ params }: { params: { slug: string } }) {
  let userInfo: User | null;
  let posts: Post[];
  try {
    userInfo = await FetchUserWithTheirHeadsOff(params.slug);
    posts = await FetchPostOfUser(params.slug);
  } catch {
    return <>failed to get user data</>;
  }
  if (userInfo) {
    return (
      <div className="flex w-full">
        <div className="flex-[2]"></div>
        <div className="flex-[5]">
          <div className="flex gap-1 bg-pri p-2 rounded-xl mb-2 mt-3">
            <Image
              src={userInfo.image}
              alt="Profile picture"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <div className="text-lg">{userInfo.name}</div>
              <div className="text-sm text-gray-600">@{userInfo.username}</div>
              <div>{userInfo.bio ? userInfo.bio : null}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {posts.map((post) => (
              <Test3 post={post} />
            ))}
          </div>
        </div>
        <div className="flex-[2]"></div>
      </div>
    );
  } else {
    return <>user doesn't exist</>;
  }
}
