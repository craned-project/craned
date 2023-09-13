import { getComment, getPost } from "@/lib/actions/newPost.action"
import { currentUser } from "@clerk/nextjs";
import { NewPost } from "@/stories/newpost";
import Post from "@/lib/models/post.model";
import { PoooooooseOrPostWhateverDonTMatter } from "@/stories/Post2IdekHowItGetThisLong";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { useUploadThing } from "@/lib/upload";
import { NewComment } from "./comment";

export default async function Test3({ post, havelinkascomment }: { post: Post, havelinkascomment: boolean }) {
    let comment: Post[];

    console.log(post)
    const authuser = await currentUser();
    if (authuser === null) {
        return <div></div>
    }
    const id = post._id;

    try {
        comment = await getComment(id)
    }
    catch {
        return <>Post doesn't exist</>
    }

    if (post === null) {
        return <div></div>
    }
    return <div className="bg-sec p-2 rounded-xl">
        <PoooooooseOrPostWhateverDonTMatter post={post} />
        <Link href={`/posts/${post._id}`}>(go to post)</Link>
        <div>
            <div>Comment:</div>
            <NewComment userid={authuser.id} parentpostid={id} />
            <div>{comment.length > 0 ? (comment.map((c) => {
                return (
                    <div><Test3 post={c} havelinkascomment={true} key={post._id} /></div>
                )
            })) : <div>So Empty </div>}</div>
        </div>
    </div>
}
