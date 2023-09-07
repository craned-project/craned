import { currentUser } from "@clerk/nextjs";
import { FetchUser } from "@/lib/actions/updateUser.action"
import { redirect } from "next/navigation";
import { AccountProfile } from "@/stories/AccountProfile";
export default async function Page() {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await FetchUser(user.id);
    if (userInfo?.onboarded) redirect("/");
    console.log(`userInfo: ${userInfo}, userid: ${user.id}`);
    const d = {
        id: user.id,
        objectId: userInfo?.id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl,
    }
    return (<main>
        <h1 className="text-3xl">Onboarding</h1>
        <AccountProfile user={d} title="Title" redirecturl="/" />
    </main>)
}
