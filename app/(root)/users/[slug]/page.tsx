import { FetchPostOfUser, FetchUserWithTheirHeadsOff} from "@/lib/actions/updateUser.action"
import Post from "@/lib/models/post.model";
import User from "@/lib/models/user.model";
import { PoooooooseOrPostWhateverDonTMatter } from "@/stories/Post2IdekHowItGetThisLong";
import Test3 from "@/stories/Post3Wow";
import Image from "next/image";
export default async function users({ params }: { params: { slug: string } }) {
    let userInfo: User | null;
    let posts: Post[];
    try {
        userInfo = await FetchUserWithTheirHeadsOff(params.slug);
        posts = await FetchPostOfUser(params.slug);
    }
    catch {
        return <>failed to get user data</>
    }
    if (userInfo) {
    return (<>
        {userInfo.name}
        {userInfo.bio ? userInfo.bio : null}
        <Image src={userInfo.image} alt="Profile picture" width={100} height={100}/>
        {posts.map(post => (<><Test3 post={post} /></>))}
    </>)
    }
    else {
        return <>user doesn't exist</>
    }
}

