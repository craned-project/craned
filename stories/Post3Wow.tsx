import { getComment, getPost } from "@/lib/actions/newPost.action"
import { currentUser } from "@clerk/nextjs";
import { NewPost } from "@/stories/newpost";
import Post from "@/lib/models/post.model";
import { PoooooooseOrPostWhateverDonTMatter } from "@/stories/Post2IdekHowItGetThisLong";

export default async function Test3({ post }: { post: Post }) {
    let comment: Post[];
    console.log(post)
    const authuser = await currentUser();
    if (authuser === null){
        return <></>
    }
    const id = post._id;

    try {
        comment = await getComment(id)
    }
    catch {
        return <>Post doesn't exist</>
    }
    if (post === null) {
        return <></>
    }
    return <div>
        <PoooooooseOrPostWhateverDonTMatter post={post} />
        <div>
            Comment: 
                <NewPost userid={authuser.id} parentpostid={id} />
                <div>{comment.length > 0 ? (comment.map(async (c) => {
                    console.log(`parent id of ${c} is ${id}`)
                    return (
                    <div><Test3 post={c} /></div>
                )})) : "No comment"}
                </div>
            </div> 
    </div>
}
