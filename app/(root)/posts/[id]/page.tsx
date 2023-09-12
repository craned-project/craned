import { getComment, getPost } from "@/lib/actions/newPost.action"
import { currentUser } from "@clerk/nextjs";
import { NewPost } from "@/stories/newpost";
import Post from "@/lib/models/post.model";
import { PoooooooseOrPostWhateverDonTMatter } from "@/stories/Post2IdekHowItGetThisLong";
import Test3 from "@/stories/Post3Wow";

export default async function test2({ params }: { params: { id: string } }) {
    let post: Post;
    let comment: Post[];
    const authuser = await currentUser();
    if (authuser === null){
        return <></>
    }
    try {
        post = await getPost(params.id)
        comment = await getComment(params.id)
    }
    catch {
        return <>Post doesn't exist</>
    }
    if (post === null) {
        return <></>
    }
    return <>
        <Test3 post={post} />
    </>
}
