"use client";
interface Props {
    userid: string;
}
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

export const NewPost = ({ userid }: Props) => {
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
        try {
            await createNewPost({ post: { text: values.text, images: null }, id: userid });
            alert("Created new post");
            router.push("/");
        }
        catch (e){
            if (e == "No School") {
                alert("You can't create new post! You currently have no school! also sus you probably can't reach this page?? contact iloveheapsort@gmail.com if you managed to do it :)");
            }
            alert("Failed to create new post");
            router.refresh();
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name='text'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
