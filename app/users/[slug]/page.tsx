'use client';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import type { Database } from "@/supabase.types";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getPfpUrl } from "@/lib/getPfpUrl";

const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3
  const from = page ? page * limit : 0
  const to = page ? from + size - 1 : size - 1

  return { from, to }
}

const ImageWithFallback = (props: { src: string, fallbackSrc: string, alt: string } & ImageProps) => {
  const { src, fallbackSrc, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default function UserPage({ params }: { params: { slug: string } }) {
  const supabase = createClientComponentClient<Database>();
  const searchParam = useSearchParams();
  const { push } = useRouter();
  const [latestPosts, setLatestPosts] = useState<{
    content: string
    id: string
    school_id: string
    timestamp: string
    user_id: string
  }[] | null>([]);
  const [page, setPage] = useState(0);
  const [name, setName] = useState("");
  const getSchoolName = async (schoolId: string) => {
    const { data: schoolName, error } = await supabase.from('schools').select("*").eq('id', schoolId);
    if (schoolName && schoolName?.length > 0) {
      console.log(schoolName)
      return schoolName[0].name
    }
    else {
      console.error(schoolName, error)
      return ""
    }
  }

  useEffect(() => {
    const fetchSession = async () => {
      //@ts-ignore
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', params.slug);
      if (users && users.length > 0) {
        const page = parseInt(searchParam.get('page') || "0")
        setPage(page);
        const { from, to } = getPagination(page, 3);
        const { data: posts, error } = await supabase.from('posts').select("*").eq('user_id', users[0].id).order('timestamp', { ascending: false }).range(from, to);
        setLatestPosts(posts || []);
        console.log(posts);
      } else {
        setLatestPosts(null);
      }
    };

    fetchSession();
  }, []);
  return (<div>
    <>slug: {params.slug}</>
    <>{latestPosts == null ? "Users doesn't exist" :
      latestPosts.length > 0 ? latestPosts.map(post =>
        <div key={post.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start', // Align items to the start
            overflowX: 'auto' // Allow scrolling when content is too large
          }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              overflow: 'hidden',
              marginRight: '15px', // Add some space between the image and the content
              position: 'relative'
            }}>
            <ImageWithFallback
              src={getPfpUrl(post.user_id)}
              alt='Profile Image'
              style={{ objectFit: "cover" }}
              fill={true}
              fallbackSrc='/uwoog.png'
            />
          </div>
          <div style={{ maxWidth: "70%" }}>{post.content}</div>
        </div>
      ) : "No post left :,("
    }</>
  </div>)
}
