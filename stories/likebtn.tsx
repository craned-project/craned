"use client";

import { getLikesCount, handleLike, getUserLikePostOrNot, handleUnlike } from "@/lib/actions/updateUser.action";
import { useState, useEffect } from "react";

export default function LikeButton({
    likes,
    userid,
    postid,
    isliking
}: {
    likes: number;
    isliking: boolean;
    userid: string;
    postid: string;
}) {
    console.log(isliking);
    const [like, setLike] = useState<number>(likes);
    const [islike, setislike] = useState<boolean>(isliking);
    const refetchdata = async () => {
        console.log("refreshing data");
        setislike(await getUserLikePostOrNot(userid, postid));
        setLike(await getLikesCount(postid));
        console.log(islike, like);
    }
    return (<div onClick={async () => {
        if (islike) {await handleUnlike(userid, postid);} else {await handleLike(userid, postid);} await refetchdata();
    }}>Heart button {"<3"}: {like}</div>);
}
