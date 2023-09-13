import { getLikesCount, getUserLikePostOrNot, likePost } from "@/lib/actions/updateUser.action";
import Post from "@/lib/models/post.model";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import LikeButton from "./likebtn";

export async function PoooooooseOrPostWhateverDonTMatter({post}: {post: Post}) {
    const user = await currentUser();
    const likecount = await getLikesCount(post._id);
    if (!user) return <></>;
    return (
        <div>
            <div>{post.text}</div>
            <div>{post.image ? (<Image src={post.image} width={500} height={500} alt="Image"/>) : <div></div>}</div>
            <LikeButton userid={user.id} postid={post._id} likes={likecount} isliking={await getUserLikePostOrNot(user.id, post._id)}/>
                    </div>
    )

}
