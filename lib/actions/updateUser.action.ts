"use server";

import User from "../models/user.model";
import Post from "../models/post.model";
import School from "../models/school.model";
import { connectToDB } from "../mongoose";
import mongoose, { PopulatedDoc, Types } from "mongoose";
import { auth } from "@clerk/nextjs/server";

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
        let returnVal = await User.findOneAndUpdate(
            { id: user.id },
            {
                username: user.username.toLowerCase(),
                name: user.name,
                bio: user.bio == "" ? null : user.bio,
                image: user.image,
                onboarded: true,
            },
            { upsert: true },
        );
        console.log("Updated user");
    } catch (e) {
        throw new Error(`Failed to create/update user: ${user.id}: ${e}`);
    }
};

export const FetchUser = async () => {
    try {
        await connectToDB();
        const { userId: userid } = auth()
        return await User.findOne({ id: userid });
    } catch (e) {
        throw new Error(`Failed to find user: ${e}`);
    }
};
export const FetchUserWithTheirHeadsOff = async (username: string) => {
    try {
        await connectToDB();
        const x = await User.findOne({ username: username });
        return x;
    } catch (e) {
        throw new Error(`Failed to find user: ${username}: ${e}`);
    }
};

export const FetchPostOfUser = async (username: string) => {
    try {
        await connectToDB();
        return await Post.find({
            author: await User.findOne({ username: username }),
        });
    } catch (e) {
        throw new Error(`Failed to find user: ${username}: ${e}`);
    }
};

export const CheckUser = async (userid: string) => {
    try {
        await connectToDB();
        const schools: School[] = await School.find({
            members: await User.findOne({ id: userid }),
        });
        return schools.length === 0 ? false : true;
    } catch (e) {
        throw new Error(`Failed to check user school: ${userid}: ${e}`);
    }
};

export async function getLikesCount(postId: string): Promise<number> {
    const likesCount = await User.countDocuments({ likes: postId });
    return likesCount;
}

export async function getUserLikePostOrNot(
    postid: string,
): Promise<boolean> {
    const { userId: userid } = auth();
    if (userid === null) {
        throw new Error("F");
    }
    const post = Post.exists({ _id: postid });
    if (post !== null) {
        const check = await User.exists({
            id: userid,
            likes: new mongoose.Types.ObjectId(postid),
        });
        if (check !== null) {
            console.log(check);
            return true;
        } else return false;
    } else {
        throw new Error(`Post doesn't exist: ${postid}`);
    }
}

// export async function getRecommendedPosts(userId: string) {
//     const user = User.findOne({ id: userId });
//     const users = await User.find({ likes: { $in: user.likes } }).lean();
//
//     // Get the posts liked by these users
//     const posts = await Post.find({ _id: { $in: users.flatMap(user => user.likes) } }).lean();
//
//     // Return the recommended posts
//     return posts;
// };
//

export async function checkUserExists(userId: string): Promise<boolean> {
    try {
        await connectToDB();
        const user = await User.findOne({ id: userId });
        return user !== null;
    } catch (error) {
        console.error("Error while checking user existence: ", error);
        return false;
    }
}

export async function checkPostExists(postId: string): Promise<boolean> {
    try {
        await connectToDB();
        const post = await Post.findOne({ _id: postId });
        return post !== null;
    } catch (error) {
        console.error("Error while checking post existence: ", error);
        return false;
    }
}

export async function handleLike(postId: string) {
    try {
        const { userId } = auth();
        if (userId === null) {
            throw new Error();
        }
        const userExists = await checkUserExists(userId);
        const postExists = await checkPostExists(postId);

        if (!userExists || !postExists) {
            throw new Error("User or post does not exist");
        }

        // Check if the user has already liked the post
        const user = await User.findOne({ id: userId, likes: postId });
        if (user !== null) {
            throw new Error("User has already liked the post");
        }

        // Add the postId to the likes array
        await User.updateOne(User.findOne({ id: userId }), {
            $addToSet: { likes: postId },
        });
    } catch (error) {
        console.error("Error while liking post: ", error);
    }
}

export async function handleUnlike(postId: string) {
    try {
        const { userId } = auth();
        if (userId === null) {
            throw new Error();
        }
        const userExists = await checkUserExists(userId);
        const postExists = await checkPostExists(postId);

        if (!userExists || !postExists) {
            throw new Error("User or post does not exist");
        }

        // Check if the user has already liked the post
        const user = await User.findOne({ id: userId, likes: postId });
        if (user === null) {
            throw new Error("User didn't even like the post");
        }

        // Remove the postId from the likes array
        await User.updateOne(User.findOne({ id: userId }), {
            $pull: { likes: postId },
        });
    } catch (error) {
        console.error("Error while unliking post: ", error);
    }
}

export async function pinning(postId: string) {
    const { userId } = auth();
    const postauthor: User = await Post.findOne({ _id: postId }).populate<{ author: User }>('author').orFail().then(post => { return post.author });
    if (School.findOne({ admin: userId }) === null) {
        throw new Error();
    } else {
        await School.findOneAndUpdate({ admin: await User.findOne({id: userId})}, { $addToSet: { pinnedpost: await Post.findOne({ _id: postId }).orFail() } });
    }
}

export async function checkadmin(postId: string) {
  const { userId } = auth();

  const postauthor: User = await Post.findOne({ _id: postId })
    .populate<{author: User}>('author')
    .orFail()
    .then((post) => {
      return post.author;
    });
  const school = await School.findOne({
    admin: await User.findOne({id: userId}),
    members: postauthor,
  });

  return school !== null;
}
