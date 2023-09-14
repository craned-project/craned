import { getMillennium } from "@/lib/actions/newPost.action";
import Link from "next/link";
import Image from "next/image"

export default async function users({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const pages = searchParams.page ? +searchParams.page : 1;
    const getOutput = await getMillennium(pages, 6);
    if (getOutput !== undefined) {
        const { mem: schoolmembers, isNext } = getOutput;
        return (
        <div className="flex w-full">
            <div className="flex-[2]"></div>
            <div className="flex-[5] bg-sec p-2 rounded-2xl mt-3 mb-3">
                <h1 className="text-pri text-3xl font-bold mb-2">Students in your school</h1>
                <div className="flex flex-col gap-2">{schoolmembers.map(member => (
                    <Link href={`/users/${member.username}`} className="flex gap-1 bg-pri p-2 rounded-xl">
                        <Image
                        src={member.image}
                        alt="Profile picture"
                        width={80}
                        height={80}
                        className="rounded-full"
                        />
                        <div className="flex flex-col">
                            <div className="text-lg">{member.name}</div>
                            <div className="text-sm text-gray-600">@{member.username}</div>
                            <div>{member.bio ? member.bio : null}</div>
                        </div>
                    </Link>
                ))}</div>
                <div>
                    {pages > 1 ? (
                        <Link href={`/users?page=${pages - 1}`} className="bg-sec hover:bg-pri hover:text-black font-bold">Go back</Link>
                    ) : (
                        <div className="flex justify-center text-lg text-pri">Can't go back</div>
                    )}
                    {isNext ? (
                        <Link href={`/users?page=${pages + 1}`} className="bg-sec hover:bg-pri hover:text-black font-bold">Go next</Link>
                    ) : (
                        <div className="flex justify-center text-lg text-pri">You just went through every users (;° ロ°)</div>
                    )}
                </div>
            </div>
            <div className="flex-[2]"></div>
        </div>);
    } else {
        return <div className="flex justify-center text-lg text-tri">You aren't in any school yet! Please contact us for more info.</div>
    }
}
