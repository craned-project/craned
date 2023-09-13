import { NewPost } from "@/stories/newpost";
import { redirect } from "next/navigation";
import { CheckUser, FetchUser } from "@/lib/actions/updateUser.action";
import { currentUser } from "@clerk/nextjs";
import School from "@/lib/models/school.model";
import User from "@/lib/models/user.model";
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
    const check = await CheckUser(authuser.id);
    // School.create({slug: "pkw", name: "Pkw", admin: await User.findOne({id: authuser.id}), members: [await User.findOne({id: authuser.id})]});
    if (!check) {
        redirect("/");
    }
    return (
        <div className="flex w-full items-center h-[calc(100vh-66px)]">
            <div className="flex-[2]"></div>
            <NewPost userid={authuser.id} className="flex-[3]"/>
            <div className="flex-[2]"></div>
        </div>
    )
}
