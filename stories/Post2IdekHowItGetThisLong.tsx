import Post from "@/lib/models/post.model";
import Image from "next/image";

export function PoooooooseOrPostWhateverDonTMatter({post}: {post: Post}) {
    return (
        <div>
            <div>{post.text}</div>
            <div>{post.image ? (<Image src={post.image} width={500} height={500} alt="Image"/>) : <div></div>}</div>
            <div>Heart button {"<3"}</div>
        </div>
    )

}
