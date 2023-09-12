"use server"
import { Model } from "mongoose";
import Post from "../models/post.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { CheckUser } from "./updateUser.action";

interface postProps {
    text: string,
    images: string[] | null,
}

export const createNewPost = async ({ post, id: userid, parent }: { post: postProps, id: string, parent?: string }) => {
    try {
        await connectToDB();

        const author = await User.findOne({ id: userid });
        if (!CheckUser(userid)) {
            console.log(`Author of post doesn't have school yet: ${userid}`);
            throw new Error("1");
        }
        if (parent) {
            const isExist = await Post.exists({ id: parent });
            if (isExist === null) { 
                throw new Error(`How did we get there ${userid}?`)
            }
            await Post.create({
                text: post.text,
                author: author,
                parentId: parent
            });
        }
        else {
            await Post.create({
                text: post.text,
                author: author,
            });
        }
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
        if (!CheckUser(userid)) {
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

export async function countPostLikes(postId: string): Promise<number> {
    const users: User[] = await User.find({ likes: postId });

    const likesCount = users.length;

    return likesCount;
}

export async function getPost(postId: string): Promise<Post> {
    const post: Post | null = await Post.findOne({ id: postId });
    if (post) return post;
    throw new Error(`Failed to get post: ${postId}`)
}

export async function getComment(postId: string): Promise<Post[]> {
    const comment: Post[] | null = await Post.find({parentId: postId});
    console.log(`Comment: ${comment}`)
    if (comment) return comment;
    throw new Error(`Failed to get comment for post: ${postId}`)
}