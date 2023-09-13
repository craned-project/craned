import { getComment, getPost } from "@/lib/actions/newPost.action"
import { currentUser } from "@clerk/nextjs";
import { NewPost } from "@/stories/newpost";
import Post from "@/lib/models/post.model";
import { PoooooooseOrPostWhateverDonTMatter } from "@/stories/Post2IdekHowItGetThisLong";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { useUploadThing } from "@/lib/upload";
import { NewComment } from "./comment";
import User from "@/lib/models/user.model";

export default async function Test3({ post }: { post: Post }) {
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
    // @ts-ignore
    const author: User = post.author;
    return <div className="bg-sec p-2 rounded-xl">
    {/* <User> type btw, you just get the pfp from auther.profile_picture or smth*/}
    <Link href={`/users/${author.username}`}>{author.name} (@{author.username})</Link>
        <PoooooooseOrPostWhateverDonTMatter post={post} />
        <Link href={`/posts/${post._id}`}>(go to post)</Link>
        <div>
            <div>Comment:</div>
            <NewComment userid={authuser.id} parentpostid={id} />
            <div>{comment.length > 0 ? (comment.map((c) => {
                return (
                    <div><Test3 post={c} key={post._id} /></div>
                )
            })) : <div>So Empty </div>}</div>
        </div>
    </div>
}
