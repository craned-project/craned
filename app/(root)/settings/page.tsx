import { AccountProfile } from "@/stories/AccountProfile";
import { FetchUser } from "@/lib/actions/updateUser.action";
import { redirect } from "next/navigation";
export default async function settingspage() {
    const userInfo = await FetchUser();
    if (userInfo === null) return (<></>);
    const d = {
        id: userInfo.id,
        objectId: userInfo?.id,
        username: userInfo?.username,
        name: userInfo?.name,
        bio: userInfo?.bio || "",
        image: userInfo?.image,
    };

    return <>
    <div className="flex justify-center items-center w-full">
        <div className="bg-tri rounded-xl p-3">
            <h1 className="text-pri text-3xl font-bold">Settings</h1>
            <AccountProfile user={d} title="Settings" redirecturl="/"/>
        </div>
    </div>
    </>
}
