"use server";
import { auth } from "@clerk/nextjs/server";
import Post from "../models/post.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { CheckUser } from "./updateUser.action";
import School from "../models/school.model";
import { revalidatePath } from "next/cache";
import { ObjectId, PopulatedDoc } from "mongoose";

interface postProps {
    text: string;
    image: string | null;
}

export const createNewPost = async ({
    post,
    parent,
}: {
    post: postProps;
    parent?: string;
}) => {
    try {
        await connectToDB();
        const { userId: userid } = auth()
        if (userid === null) {
            throw new Error("No log in?");
        }
        const author = await User.findOne({ id: userid });
        if (!CheckUser(userid)) {
            console.log(`Author of post doesn't have school yet: ${userid}`);
            throw new Error("1");
        }
        if (parent) {
            const isExist = await Post.exists({ id: parent });
            if (isExist === null) {
                throw new Error(`How did we get there ${userid}?`);
            }
            await Post.create({
                text: post.text,
                image: post.image,
                author: author,
                parentId: parent,
            });
        } else {
            await Post.create({
                text: post.text,
                image: post.image,
                author: author,
            });
        }
        revalidatePath("/");
    } catch (e) {
        if (e == "1") {
            return "No School";
        }
        throw new Error(`Failed to create post: ${e}`);
    }
};

export const createNewComment = async ({
    post,
    id: userid,
    toppostid,
}: {
    post: postProps;
    id: string;
    toppostid: string;
}) => {
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
            parentId: toppostid,
        });
        console.log("Created new post");
    } catch (e) {
        if (e == "1") {
            return "No School";
        }
        throw new Error(`Failed to create comment: ${userid}: ${e}`);
    }
};

export async function countPostLikes(postId: string): Promise<number> {
    const users: User[] = await User.find({ likes: postId });

    const likesCount = users.length;

    return likesCount;
}

export async function getPost(postId: string): Promise<Post> {
    const post: Post | null = await Post.findOne({ _id: postId });
    if (post) return post;
    throw new Error(`Failed to get post: ${postId}`);
}

export async function getComment(postId: string): Promise<Post[]> {
    const comment: Post[] | null = await Post.find({ parentId: postId }).sort(
        "-createdAt",
    );
    console.log(`Comment: ${comment}`);
    if (comment) return comment;
    throw new Error(`Failed to get comment for post: ${postId}`);
}

export async function fetchPosts(pageNumber = 1, pageSize = 5) {
    try {
        connectToDB();
        // Calculate the number of posts to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;
        // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
        const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: "author",
                model: User,
            });
        // Count the total number of top-level posts (threads) i.e., threads that are not comments.
        const totalPostsCount = await Post.countDocuments({
            parentId: { $in: [null, undefined] },
        }); // Get the total count of posts
        const posts = await postsQuery.exec();
        const isNext = totalPostsCount > skipAmount + posts.length;
        return { posts, isNext };
    } catch {
        console.log("Failed to load post");
        throw new Error(`Failed to load posts`);
    }
}

export async function getMillennium(pageNumber = 1, pageSize = 5) {
    try {
        const { userId } = auth();
        if (userId === null) {
            throw new Error();
        }
        const skipAmount = (pageNumber - 1) * pageSize;
        if (await CheckUser(userId)) {
            const user = await User.findOne({ id: userId });
            //            const school: User[] | null = await School.findOne({
            //                members: user,
            //            }).skip(skipAmount).limit(pageSize).populate<{ members: User[] }>('members').orFail().then(sch => {
            //                console.log(`Millennium school students: ${sch}`);
            //                return sch.members;
            //            });
            const school = await School.findOne({ members: user }).orFail();
            if (school === null) {
                return undefined;
            }
            const paginatedMembers: User[] | null = await User.find({ _id: { $in: school.members } })
                .sort("id")
                .skip(skipAmount)
                .limit(pageSize);
            return {mem: paginatedMembers, isNext: school.members.length > skipAmount + paginatedMembers.length};
        }
    }
    catch (e) {
        throw new Error(`failed to get students in millennium: ${e}`);
    }
}
