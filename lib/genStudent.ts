import School from "./models/school.model";
import User from "./models/user.model";
import { connectToDB } from "./mongoose"

async function addStudentToSchool(slug: string, userid: string) {
    try {
        connectToDB();
        return await School.findOneAndUpdate({slug: slug}, {$addToSet: {members: await User.findOne({id: userid})}});
    }
     catch (e) {
         console.error(e);
     }
}

await addStudentToSchool("pkw", "user_2VN6q4Vs7tJDveZewRmsf4vAEkv").then(x => console.log(x));
