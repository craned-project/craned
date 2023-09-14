import { getSchool } from "@/lib/actions/schools.action"
import School from "@/lib/models/school.model";

export default async function SchoolMain() {
    const schools = await getSchool();
    if (schools === undefined) {
        return <>No schools?</>
    }
    return <div>{schools.map(school => { return <div>{school.name} ({school.members?.length} student(s)) (admin: {school.admin.name})</div> })}</div>
}
