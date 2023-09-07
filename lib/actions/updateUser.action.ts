"use server"

import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface userProps {
        id: string;
        username: string;
        name: string;
        bio: string;
        image: string;
}

export const UpdateUser = async (user : userProps) => {
    try {
        await connectToDB();
        await User.findOneAndUpdate({id: user.id}, {
            username: user.username.toLowerCase(),
            name: user.name,
            bio: user.bio,
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
        return await User.findOne({id: userid});
    } catch (e) {
        throw new Error(`Failed to find user: ${userid}: ${e}`);
    }
}

