import { getMillennium } from "@/lib/actions/newPost.action";
import Link from "next/link";

export default async function users({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const pages = searchParams.page ? +searchParams.page : 1;
    const getOutput = await getMillennium(pages, 6);
    if (getOutput !== undefined) {
        const { mem: schoolmembers, isNext } = getOutput;
        console.log(schoolmembers);
        return (<div>
            <div>Students in your school</div>
            <div>{schoolmembers.map(member => member.name)}</div>
            <div>
                {pages > 1 ? (
                    <Link href={`/users?page=${pages - 1}`}>Go back</Link>
                ) : (
                    <>Can't go back</>
                )}
                {isNext ? (
                    <Link href={`/users?page=${pages + 1}`}>Go next</Link>
                ) : (
                    <>You just went through every users (;° ロ°)</>
                )}
            </div>
        </div>);
    } else {
        return <>You aren't in any school yet! Please contact us for more info.</>
    }
}
