import { getComment, getPost } from "@/lib/actions/newPost.action";
import { currentUser } from "@clerk/nextjs";
import Post from "@/lib/models/post.model";
import Test3 from "@/stories/Post3Wow";

export default async function test2({ params }: { params: { id: string } }) {
  let post: Post;
  let comment: Post[];
  const authuser = await currentUser();
  if (authuser === null) {
    return <></>;
  }
  try {
    post = await getPost(params.id);
    console.log(`I requested ${params.id} and get ${post._id}`);
    comment = await getComment(params.id);
  } catch {
    return <>Post doesn't exist</>;
  }
  if (post === null) {
    return <></>;
  }
  return (
    <div>
      <Test3 post={post} havelinkascomment={false} />
    </div>
  );
}
