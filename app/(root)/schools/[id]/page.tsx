import { currentUser } from "@clerk/nextjs/server";
import School from "@/lib/models/school.model";
import User from "@/lib/models/user.model";
import { redirect } from "next/navigation";
import Post from "@/lib/models/post.model";
import Test3 from "@/stories/Post3Wow";
import Image from "next/image"
import { getPinnedPost } from "@/lib/actions/schools.action";
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

    const pinned: Post[] = await getPinnedPost(params.id);
  const admin: School | null = await User.findOne(school.admin);

  console.log(school);
  return (
    <div>
      <div className="flex gap-1 bg-pri p-2 rounded-xl mb-2 mt-3">
        {school.image && <Image
          src={school.image}
          alt="Profile picture"
          width={80}
          height={80}
          className="rounded-full"
        />}
        <div className="flex flex-col">
          <div className="text-xl">{school.name}</div>
          <div>{school.bio ? school.bio : null}</div>
          <div>{admin ? (
            <h2>Admin: {admin.name}</h2>
          ) : (
            <h2>Admin: None</h2>
          )}</div>
        </div>

      </div>
      <div className="flex flex-col gap-2">
      Pinned Post:
      {pinned.map((pin) => {pin.text})}
        {allPosts.map((post) => {
          return (
            <div className="flex flex-col gap-2">
              <Test3 post={post} />
            </div>
          );
        })}
      </div>
    </div>

  )
}
