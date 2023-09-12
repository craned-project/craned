"use server"

import User from "../models/user.model";
import Post from "../models/post.model"
import School from "../models/school.model";
import { connectToDB } from "../mongoose"

interface userProps {
    id: string;
    username: string;
    name: string;
    bio: string | null;
    image: string;
}

export const UpdateUser = async (user: userProps) => {
    try {
        await connectToDB();
        let returnVal = await User.findOneAndUpdate({ id: user.id }, {
            username: user.username.toLowerCase(),
            name: user.name,
            bio: user.bio == "" ? null : user.bio,
            image: user.image,
            onboarded: true
        }, { upsert: true });
        console.log("Updated user");
    } catch (e) {
        throw new Error(`Failed to create/update user: ${user.id}: ${e}`);
    }
}

export const FetchUser = async (userid: string) => {
    try {
        await connectToDB();
        return await User.findOne({ id: userid });
    } catch (e) {
        throw new Error(`Failed to find user: ${userid}: ${e}`);
    }
}
export const FetchUserWithTheirHeadsOff = async (username: string) => {
    try {
        await connectToDB();
        const x = await User.findOne({ username: username });
        return x
    } catch (e) {
        throw new Error(`Failed to find user: ${username}: ${e}`);
    }
}

export const FetchPostOfUser = async (username: string) => {
    try {
        await connectToDB();
        return await Post.find({author: await User.findOne({username: username})});
    } catch (e) {
        throw new Error(`Failed to find user: ${username}: ${e}`);
    }
}

export const CheckUser = async (userid: string) => {
    try {
        await connectToDB();
        const schools: School[] = await School.find({ members: await User.findOne({ id: userid }) });
        return schools.length === 0 ? false : true;
    } catch (e) {
        throw new Error(`Failed to check user school: ${userid}: ${e}`);
    }
}


export async function likePost(userId: string, postId: string): Promise<void> {
    // Add the post ID to the user's likes array
    try {
        let callback = await User.updateOne(
            { _id: userId },
            { $addToSet: { likes: postId } }
        );
    }
    catch (e) {
        throw new Error(`Failed to like post: ${userId}, ${postId}`);
    }
}

export async function getRecommendedPosts(userId: string) {
    const user = User.findOne({ id: userId });
    const users = await User.find({ likes: { $in: user.likes } }).lean();

    // Get the posts liked by these users
    const posts = await Post.find({ _id: { $in: users.flatMap(user => user.likes) } }).lean();

    // Return the recommended posts
    return posts;
};

