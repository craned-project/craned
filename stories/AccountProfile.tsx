"use client";
interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  title: string;
  redirecturl: string;
}
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
import { UserValidation } from "@/lib/validation";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { UpdateUser } from "@/lib/actions/updateUser.action";
import { useRouter } from "next/navigation";
import { User } from "@clerk/nextjs/api";
import Page from "@/app/(auth)/onboard/page";
import { revalidatePath } from "next/cache";

function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export const AccountProfile = ({ user, title, redirecturl }: Props) => {
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user.image || "",
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
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
  async function onSubmit(values: z.infer<typeof UserValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }
    console.log(values);
    try {
      await UpdateUser({
        name: values.name,
        username: values.username,
        bio: values.bio,
        id: user.id,
        image: values.profile_photo,
      });
    } catch (e) {
      alert(
        "failed to create/update user! please change your username or try again later",
      );
      router.refresh();
    }
    revalidatePath("/")
    router.push(redirecturl);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex gap-3">
          <div className="flex-[2]">
            <FormField
              control={form.control}
              name="profile_photo"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel>
                    {field.value ? (
                      <Image
                        src={field.value}
                        alt="profile_icon"
                        width={70}
                        height={70}
                        priority
                        className="rounded-full object-contain"
                      />
                    ) : (
                      <Image
                        src="/uwoog.png"
                        alt="profile_icon"
                        width={70}
                        height={70}
                        className="object-contain"
                      />
                    )}
                  </FormLabel>
                  <FormControl className="flex-1 text-base-semibold text-gray-200">
                    <Input
                      type="file"
                      accept="image/*"
                      placeholder="Add profile photo"
                      className="account-form_image-input"
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col mt-2 outline-0">
                  <FormControl>
                    <Input
                      type="text"
                      className="account-form_input no-focus border-none outline-none placeholder:text-gray-500 placeholder:text-lg placeholder:font-overpass font-overpass text-lg"
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 w-full mt-0 outline-0">
                  <FormLabel className="text-semibold text-xl text-gray-500">
                    @
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="account-form_input no-focus border-none outline-none placeholder:text-gray-500 placeholder:text-lg placeholder:font-overpass font-overpass text-lg"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-[2]">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2 outline-0">
                  <FormLabel className="text-base-semibold text-white">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      className="account-form_input no-focus border-none outline-none placeholder:text-gray-500 placeholder:text-lg placeholder:font-overpass font-overpass text-lg resize-none"
                      {...field}
                      placeholder="Bio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <Button
            type="submit"
            className="bg-sec hover:bg-pri hover:text-black font-bold"
          >
            I'm Satisfied
          </Button>
        </div>
      </form>
    </Form>
  );
};
