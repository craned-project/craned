import { currentUser } from "@clerk/nextjs";
import { FetchUser } from "@/lib/actions/updateUser.action";
import { redirect } from "next/navigation";
import { AccountProfile } from "@/stories/AccountProfile";
export default async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await FetchUser();
  if (userInfo?.onboarded) redirect("/");
  console.log(`userInfo: ${userInfo}, userid: ${user.id}`);
  const d = {
    id: user.id,
    objectId: userInfo?.id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };
  return (
    <main className="flex justify-center items-center bg-light h-screen">
      <div className="flex flex-col justify-center items-center bg-pri p-7 max-w-[60%] rounded-2xl">
        <h1 className="text-3xl text-center text-pri font-bold">
          Let's Get You On Board!
        </h1>
        <p className="text-lg text-white">
          Welcome, new member! Let's continue your signing up here!
        </p>
        <AccountProfile
          user={d}
          authuser={user}
          title="Title"
          redirecturl="/"
        />
      </div>
    </main>
  );
}
