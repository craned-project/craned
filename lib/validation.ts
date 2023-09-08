import * as z from "zod";

export const UserValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(3, "Name must be longer than 3 character").max(30, "Name must be less than 30 character"),
    username: z.string().min(3, "Username must be longer than 3 character").max(20, "Username must be less than 20 character").regex(/^[a-z][a-z0-9]+(?:[a-z0-9]+)*$/, "Must start with character (can have number) and only have uncapitalized character"),
    bio: z.string().max(3000, "Bio must be less than 3000 character"),
})
export const PostValidation = z.object({
    text: z.string(),
    images: z.array(z.string().url()).or(z.null()),
});
