import Post from "@/lib/models/post.model";
import Image from "next/image";

export function PoooooooseOrPostWhateverDonTMatter({post}: {post: Post}) {
    return (
        <div>
            <div className="text-white text-lg">{post.text}</div>
            <div className="flex justify-center items-center">{post.image ? (<Image src={post.image} width={400} height={400} alt="Image" className="bg-pri object-cover rounded-2xl w-[400px] h-[400px]"/>) : <div></div>}</div>
            <div>Heart button {"<3"}</div>
        </div>
    )

}
