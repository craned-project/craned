"use server"

import Post from "../models/post.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface postProps {
    text: string,
    images: string[] | null,
}

export const createNewPost = async ({ post, id: userid }: { post: postProps, id: string }) => {
    try {
        await connectToDB();

        const author = await User.findOne({ id: userid });
        if (author.School == null) {
            console.log(`Author of post doesn't have school yet: ${userid}`);
            throw new Error("1");
        }
        await Post.create({
            text: post.text,
            author: author,
        });
        console.log("Created new post");
    } catch (e) {
        if (e == "1") {
            return "No School"
        }
        throw new Error(`Failed to create post: ${userid}: ${e}`);
    }
}

export const createNewComment = async ({ post, id: userid, toppostid }: { post: postProps, id: string, toppostid: string }) => {
    try {
        await connectToDB();

        const author = await User.findOne({ id: userid });
        if (author.School == null) {
            console.log(`Author of post doesn't have school yet: ${userid}`);
            throw new Error("1");
        }
        const originalThread = await Post.findOne({ id: toppostid });
        if (!originalThread) {
            throw new Error("Original post not found");
        }
        await Post.create({
            text: post.text,
            author: author,
            parentId: toppostid
        });
        console.log("Created new post");
    } catch (e) {
        if (e == "1") {
            return "No School"
        }
        throw new Error(`Failed to create comment: ${userid}: ${e}`);
    }
}


