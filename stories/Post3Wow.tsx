import { getComment, getPost } from "@/lib/actions/newPost.action";
import Post from "@/lib/models/post.model";
import { PoooooooseOrPostWhateverDonTMatter } from "@/stories/Post2IdekHowItGetThisLong";
import Link from "next/link";
import { NewComment } from "./comment";
import User from "@/lib/models/user.model";
import { pinning } from "@/lib/actions/updateUser.action";
import { PinPost } from "./pinpost";

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
    <div className="bg-sec p-2 rounded-xl">
      {/* <User> type btw, you just get the pfp from auther.profile_picture or smth*/}
      <Link href={`/users/${author.username}`}>
        {author.name} (@{author.username})
      </Link>
      <PinPost postid={post._id}/>
      <PoooooooseOrPostWhateverDonTMatter post={post} />
      <Link href={`/posts/${post._id}`}>(go to post)</Link>
      <div>
        <div>Comment:</div>
        <NewComment parentpostid={id} />
        <div>
          {comment.length > 0 ? (
            comment.map((c) => {
              return (
                <div>
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
