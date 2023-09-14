import { ClerkProvider, SignOutButton, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { FetchUser } from "@/lib/actions/updateUser.action";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import ActiveLink from "@/stories/usedLinks";
export const metadata = {
  title: "Craned",
  description: "Wat",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user)
    return (
      <ClerkProvider>
        <div>
          Hi!
          {children}
        </div>
      </ClerkProvider>
    );
  const userInfo = await FetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboard");
  return (
    <ClerkProvider>
      <div className="sticky top-0">
        <div className="flex justify-between bg-sec p-2">
          <div className="flex items-center">
            <Link href="/">
              <Image
                alt="logo"
                src="../Craned Logo.svg"
                width={50}
                height={50}
              ></Image>
            </Link>
            <span className="text-pri text-4xl font-bold font-overpass">
              Craned
            </span>
          </div>
          <SignedOut>
            <SignInButton>Sign In</SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex gap-2 mr-3 items-center">
              <div className="flex flex-col items-bottom gap-0">
                <span className="text-right text-white font-overpass text-lg">
                  {userInfo.name}
                </span>
                <span className="text-right text-gray-200 font-overpass text-sm">
                  @{userInfo.username}
                </span>
              </div>
              <Image
                className="rounded-full"
                alt="Profile Picture"
                width={50}
                height={50}
                src={userInfo.image}
              />
              <SignOutButton>
                <span className="flex justify-center items-center rounded-xl p-1 bg-tri hover:bg-pri text-white hover:text-tri font-overpass transition-[250ms] h-[35px]">
                  Sign out
                </span>
              </SignOutButton>
            </div>
          </SignedIn>
        </div>
      </div>

      <div className="flex ">
        <div className="w-1/10 bg-sec h-[calc(100vh-66px)] top-[66px] sticky">
          <nav className="flex flex-col gap-1 p-2 mt-5 ">
            <ActiveLink href="/">
              <div className="flex flex-col justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 576 512"
                  className="fill-white h-[25px]"
                >
                  <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                </svg>
                <div className="text-center text-white font-overpass w-full">
                  Home
                </div>
              </div>
            </ActiveLink>
            <ActiveLink href="/new">
              <div className="flex flex-col justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  className="fill-white h-[25px]"
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                </svg>
                <div className="text-center text-white font-overpass w-full">
                  New Post
                </div>
              </div>
            </ActiveLink>
            <ActiveLink href="/users">
              <div className="flex flex-col justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="fill-white flex justify-center items-center h-[30px]"
                >
                  <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z"/>                
                  </svg>
                  <div className="text-center text-white font-overpass w-full">
                  School Mates
                </div>
              </div>
            </ActiveLink>
            <ActiveLink href="/settings">
              <div className="flex flex-col justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="fill-white h-[25px] w-[25px]"
                >
                  <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                </svg>
                <div className="text-center text-white font-overpass w-full">
                  Setting
                </div>
              </div>
            </ActiveLink>
          </nav>
        </div>
        {children}
      </div>
    </ClerkProvider>
  );
}
