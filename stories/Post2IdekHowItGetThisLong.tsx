import {
  getLikesCount,
  getUserLikePostOrNot,
} from "@/lib/actions/updateUser.action";
import Post from "@/lib/models/post.model";
import Image from "next/image";
import LikeButton from "./likebtn";
import { Share } from "./share";
import Link from "next/link"

export async function PoooooooseOrPostWhateverDonTMatter({
  post,
}: {
  post: Post;
}) {
  const likecount = await getLikesCount(post._id);
  return (
    <div>
      <div className="text-white text-lg">{post.text}</div>
      <div className="flex justify-center items-center">
        {post.image ? (
          <Image
            src={post.image}
            width={400}
            height={400}
            alt="Image"
            className="bg-pri object-cover rounded-2xl w-[400px] h-[400px]"
          />
        ) : (
          <div></div>
        )}
      </div>
      <div className="mt-1 flex">
        <div className="flex items-center justify-between bg-pri p-1 rounded-lg gap-3 mb-1">
          <LikeButton
            postid={post._id}
            likes={likecount}
            isliking={await getUserLikePostOrNot(post._id)}
          />
          <Share
            url={`${process.env.VERCEL_URL || "localhost:3000"}/posts/${
              post._id
            }`}
          />
          <Link href={`/posts/${post._id}`} className="flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="fill-gray-900">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
            </svg>
            <div>Go To Post</div>
        </Link>
        </div>
      </div>
    </div>
  );
}
