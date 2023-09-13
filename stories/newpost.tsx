"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcn/ui/form"
import { Textarea } from "@/shadcn/ui/textarea";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import * as z from "zod";
import { useUploadThing } from "@/lib/upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { PostValidation } from "@/lib/validation";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { UpdateUser } from "@/lib/actions/updateUser.action";
import { useRouter } from "next/navigation";
import Post from "@/lib/models/post.model";
import User from "@/lib/models/user.model";
import { createNewPost } from "@/lib/actions/newPost.action";
function isBase64Image(imageData: string) {
    const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
    return base64Regex.test(imageData);
}

export const NewPost = ({ userid, parentpostid }: { userid: string, parentpostid?: string }) => {
    const { startUpload } = useUploadThing("media");
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const form = useForm({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            text: "",
            images: null,
        }
    });
    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };
    async function onSubmit(values: z.infer<typeof PostValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        const blob = values.images;
        if (blob !== null) {

        const hasImageChanged = isBase64Image(blob);
        if (hasImageChanged) {
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].url) {
                values.images= imgRes[0].url;
            }
        }
        }
        try {
            if (parentpostid) {
                await createNewPost({ post: { text: values.text, image: values.images}, id: userid, parent: parentpostid })
            }
            else {
                await createNewPost({ post: { text: values.text, image: values.images}, id: userid });

                alert("Created new post");
                router.push("/");
            }
        }
        catch (e) {
            if (e == "No School") {
                alert("You can't create new post! You currently have no school! also sus you probably can't reach this page?? contact iloveheapsort@gmail.com if you managed to do it :)");
            }
            alert("Failed to create new post: " + e);
            router.refresh();
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center m-7 rounded-lg p-3 w-full bg-pri h-3/5 font-overpass">
                <FormField
                    control={form.control}
                    name='text'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-2xl font-bold text-tri'>
                                New Post!
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className='placeholder:text-gray-500 text-lg h-3/5 resize-none p-2 rounded-lg w-full outline-none'
                                    rows={10}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='images'
                    control={form.control}
                    render={({ field }) => (
                        <FormControl>
                            <FormItem>
                                {field.value && (
                                    <Image
                                        src={field.value}
                                        alt='profile_icon'
                                        width={70}
                                        height={70}
                                        priority
                                        className='rounded-full object-contain'
                                    />
                                )}
                                <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                    <Input
                                        type='file'
                                        accept='image/*'
                                        placeholder='Add profile photo'
                                        className='account-form_image-input'
                                        onChange={(e) => handleImage(e, field.onChange)}
                                    />
                                </FormControl>
                            </FormItem>
                        </FormControl>
                    )}
                />
                <div className="flex justify-end mt-3">
                    <Button type="submit" className="bg-sec text-white text-lg hover:bg-tri">Post!</Button>
                </div>
            </form>
        </Form>
    )
}
