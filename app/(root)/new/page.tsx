import { NewPost } from "@/stories/newpost";
import { redirect } from "next/navigation";
import { FetchUser } from "@/lib/actions/updateUser.action";
import { currentUser } from "@clerk/nextjs";
/*
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    }
 * */
export default async function Page() {
    const authuser = await currentUser();
    if (!authuser) return null;
    const userInfo = await FetchUser(authuser.id);
    if (userInfo.school == null) {
        redirect("/");
    }
    return (
        <div className="flex">
            <h1 className="text-3xl">New post</h1>
            <NewPost userid={authuser.id} />
        </div>
    )
}
