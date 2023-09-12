"use client";

import Post from "@/lib/models/post.model";
import Image from "next/image";

export function PoooooooseOrPostWhateverDonTMatter({post}: {post: Post}) {
    console.log(post);
    return (
        <div>
            <div>{post.text}</div>
            <div>{post.images ? post.images.map(p => (
                <Image src={p} width={100} height={100} alt="Image" />
            )) : <div></div>}</div>
            <div>Heart button {"<3"}</div>
        </div>
    )

}
