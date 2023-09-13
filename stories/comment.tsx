"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Textarea } from "@/shadcn/ui/textarea";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import * as z from "zod";
import { useUploadThing } from "@/lib/upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostValidation } from "@/lib/validation";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { UpdateUser } from "@/lib/actions/updateUser.action";
import { useRouter } from "next/navigation";
import Post from "@/lib/models/post.model";
import User from "@/lib/models/user.model";
import { createNewPost } from "@/lib/actions/newPost.action";
import { cn } from "@/lib/utils";
function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export const NewComment = ({
  userid,
  parentpostid,
  className,
}: {
  userid: string;
  parentpostid?: string;
  className?: string;
}) => {
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      text: "",
      images: null,
    },
  });
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
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
    console.log(values);
    const blob = values.images;
    if (blob !== null) {
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].url) {
          values.images = imgRes[0].url;
        }
      }
    }
    try {
      if (parentpostid) {
        await createNewPost({
          post: { text: values.text, image: values.images },
          id: userid,
          parent: parentpostid,
        });
      } else {
        await createNewPost({
          post: { text: values.text, image: values.images },
          id: userid,
        });

        alert("Created new post");
        router.push("/");
      }
    } catch (e) {
      if (e == "No School") {
        alert(
          "You can't create new post! You currently have no school! also sus you probably can't reach this page?? contact iloveheapsort@gmail.com if you managed to do it :)",
        );
      }
      alert("Failed to create new post: " + e);
      router.refresh();
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col gap-1 justify-center items-start m-7 rounded-lg p-3 bg-pri h-min",
          className,
        )}
      >
        <FormLabel className="text-xl font-bold text-tri block">
          Comment
        </FormLabel>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl className="w-full">
                <Textarea
                  className="placeholder:text-gray-500 w-[500px] text-lg resize-none p-2 rounded-lg outline-none"
                  placeholder="Message"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="images"
          control={form.control}
          render={({ field }) => (
            <FormControl>
              <FormItem className="">
                {field.value ? (
                  <div className="mt-4">
                    <FormLabel className="">
                      <div className="rounded-full bg-tri p-2 flex justify-center items-center gap-1 w-fit mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="fill-white h-[20px] w-[20px]"
                        >
                          <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                        </svg>
                        <div className="text-white text-sm">Photo</div>
                      </div>
                    </FormLabel>
                    <Image
                      src={field.value}
                      alt="post img"
                      width={400}
                      height={400}
                      priority
                      className="rounded-xl object-cover w-[200px] h-[200px] block bg-tri"
                    />
                  </div>
                ) : (
                  <FormLabel className="">
                    <div className="rounded-full bg-tri p-2 flex justify-center items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="fill-white h-[20px] w-[20px]"
                      >
                        <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                      </svg>
                      <div className="text-white text-sm">Photo</div>
                    </div>
                  </FormLabel>
                )}
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Add profile photo"
                    className="account-form_image-input hidden"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            </FormControl>
          )}
        />

        <div className="flex justify-end mt-3 w-full">
          <Button
            type="submit"
            className="bg-sec text-white text-lg hover:bg-tri"
          >
            Post!
          </Button>
        </div>
      </form>
    </Form>
  );
};
