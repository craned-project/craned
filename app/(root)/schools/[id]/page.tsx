import { useOrganizationList } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function page({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null;

    const communityDetails = await fetchCommunityDetails(params.id);
    return <></>
}
