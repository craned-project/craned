import { currentUser } from "@clerk/nextjs/server";
import School from "@/lib/models/school.model";
import User from "@/lib/models/user.model";
import { redirect } from "next/navigation";
import Post from "@/lib/models/post.model";
import Test3 from "@/stories/Post3Wow";
export default async function page({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null;

    const school: School | null = await School.findOne({ slug: params.id });
    if (school == null) {
        redirect("/");
    }
    const allPosts: Post[] = await Post.aggregate([
        {
            $match: {
                author: { $in: school.members },
            },
        },
        {
            $sort: { createdAt: -1 },
        },
    ]);

    console.log("All Posts:", allPosts);


    const admin: School | null = await User.findOne(school.admin)

    console.log(school);
    return <>
        <h1>{school.name} (@{school.slug})</h1>
        {admin ? (
            <>
                <h2>Admin: </h2>
                {admin.name}
            </>
        ) : (
            <></>
        )}
        <h2>Students count: {school.members.length}</h2>
        {allPosts.map(post => {
            return <div><Test3 post={post} havelinkascomment={true}/></div>
        })}

    </>
}
