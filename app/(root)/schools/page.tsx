import { getSchool } from "@/lib/actions/schools.action"
import School from "@/lib/models/school.model";
import Link from "next/link"
import Image from "next/image"

export default async function SchoolMain() {
    const schools = await getSchool();
    if (schools === undefined) {
        return <>No schools?</>
    }
    return (
        <div>
            <h1 className="text-tri text-3xl font-bold mt-2 mb-2">โรงเรียนทั้งหมด</h1>
            <div className="flex flex-col gap-2">
            {schools.map(school => { 
                    return <div>
                        <Link href={`/schools/${school.slug}`} className="flex gap-1 bg-pri p-2 rounded-xl"> 
                        <Image
                        src={school.image ? (school.image) : ("../Craned Logo.svg")}
                        alt="Profile picture"
                        width={80}
                        height={80}
                        className="rounded-full"
                        />
                        <div className="flex flex-col">
                            <div className="text-lg">{school.name}</div>
                            <div className="text-sm text-gray-600">{school.members?.length} student(s)</div>
                            <div>Admin: {school.admin.name}</div>
                        </div> 
                        </Link>
                    </div>
            })}
            </div>
        </div>
        )
}
