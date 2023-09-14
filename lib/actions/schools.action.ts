"use server";
import { Types, PopulatedDoc } from "mongoose";
import Post from "../models/post.model";
import School from "../models/school.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface SchoolProps {
    slug: String;
    name: String;
    image?: String | undefined;
    bio?: String | undefined;
    admin: User;
    members?: Types.ObjectId[];
    pinnedpost?: Types.ObjectId[];
};


export async function fetchCommunityDetails(id: string) {
    try {
        connectToDB();

        const communityDetails = await School.findOne({ id }).populate([
            "createdBy",
            {
                path: "members",
                model: User,
                select: "name username image _id id",
            },
        ]);

        return communityDetails;
    } catch (error) {
        throw error;
    }
}

export async function getSchool(pageNumber = 1, pageSize = 5) {
    try {
        await connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;
        const schools: SchoolProps[] = await School.find()
            .sort("")
            .skip(skipAmount)
            .limit(pageSize)
            .populate<{ admin: User }>("admin")
            .orFail()
            .exec()
            .then(sch => { return sch });
        return schools;
    }
    catch (e) {
        console.log(e);
    }
}

export async function getPinnedPost(schoolId: string) {
    const posts: Post | Post[] = await School.findOne({ slug: schoolId }).populate<{ pinnedpost: Post }>("pinnedpost").orFail().then((sch) => { return sch.pinnedpost });
    if (Array.isArray(posts)) {
        return posts;
    }
    return [posts];
}
