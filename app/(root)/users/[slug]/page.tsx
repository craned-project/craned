import { FetchUserWithTheirHeadsOff} from "@/lib/actions/updateUser.action"
import User from "@/lib/models/user.model";
import Image from "next/image";
export default async function users({ params }: { params: { slug: string } }) {
    let userInfo: User | null;
    try {
        userInfo = await FetchUserWithTheirHeadsOff(params.slug);
    }
    catch {
        return <>failed to get user data</>
    }
    if (userInfo) {
    return (<>
        {userInfo.name}
        {userInfo.bio ? userInfo.bio : null}
        <Image src={userInfo.image} alt="Profile picture" width={100} height={100}/>
    </>)
    }
    else {
        return <>user doesn't exist</>
    }
}

