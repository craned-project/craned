import { currentUser } from "@clerk/nextjs"
import { AccountProfile } from "@/stories/AccountProfile";
export default async function Page() {
    const user = await currentUser();
    const userInfo = {};
    const d = {
        id: 'id',
        objectId: userInfo?.id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl,
    }
    return (<main>
        <h1 className="head-text">Onboarding</h1>
        <AccountProfile user={d} title="Title" />
    </main>)
}
