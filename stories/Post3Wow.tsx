import { getComment, getPost } from "@/lib/actions/newPost.action";
import Post from "@/lib/models/post.model";
import { PoooooooseOrPostWhateverDonTMatter } from "@/stories/Post2IdekHowItGetThisLong";
import Link from "next/link";
import { NewComment } from "./comment";
import User from "@/lib/models/user.model";
import { pinning } from "@/lib/actions/updateUser.action";
import { PinPost } from "./pinpost";
import Image from "next/image"

export default async function Test3({ post }: { post: Post }) {
  let comment: Post[];

  console.log(post);
  const id = post._id;

  try {
    comment = await getComment(id);
  } catch {
    return <>Post doesn't exist</>;
  }

  if (post === null) {
    return <div></div>;
  }
  const author: User | null = await User.findOne({_id: post.author});
  console.log(author);
  if (author === null) {
    return <></>; // I'm coping
  }
  return (
    <div className="bg-sec p-3 rounded-xl">
      {/* <User> type btw, you just get the pfp from auther.profile_picture or smth*/}
      <div className="flex gap-1 items-center">
        <Image
          src={author.image}
          alt="pfp"
          width={50}
          height={50}
          className="rounded-full"
        />
        <Link href={`/users/${author.username}`} className="flex flex-col">
          <div className="text-lg text-white flex gap-1 items-center">{author.name}</div>
          <div className="text-sm text-gray-400">@{author.username}</div>
        </Link>
        <PinPost postid={post._id}/>
      </div>
      <PoooooooseOrPostWhateverDonTMatter post={post} />
      <div>
        <NewComment parentpostid={id} />
        <div>
          {comment.length > 0 ? (
            comment.map((c) => {
              return (
                <div className="pl-4">
                  <Test3 post={c} key={post._id} />
                </div>
              );
            })
          ) : (
            <div>So Empty </div>
          )}
        </div>
      </div>
    </div>
  );
}
