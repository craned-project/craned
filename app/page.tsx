"use client";
import Image, { ImageProps } from 'next/image'
import Post from '@/stories/Post'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react';
import type { Database } from '@/supabase.types'
import { useRouter, useSearchParams } from 'next/navigation'
import { getPfpUrl } from '@/lib/getPfpUrl';


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

const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3
  const from = page ? page * limit : 0
  const to = page ? from + size - 1 : size - 1

  return { from, to }
}

export default function Home() {
  const supabase = createClientComponentClient<Database>();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [userid, setUserid] = useState("");
  const [page, setPage] = useState(0);
  const [latestPosts, setLatestPosts] = useState<{
    content: string
    id: string
    school_id: string
    timestamp: string
    user_id: string
  }[]>([]);
  const searchParam = useSearchParams();
  const [schoolId, setSchoolId] = useState("");
  const [name, setName] = useState("");
  const { push } = useRouter();
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
      const { data: { session: fetchedSession } } = await supabase.auth.getSession();
      if (fetchedSession) { }
      else {
        push("/login")
      }
      if (fetchedSession) {
        //@ts-ignore
        setEmail(fetchedSession.user.email);
        setUserid(fetchedSession.user.id);
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', fetchedSession.user.id);
        console.log(error)
        console.log(users)
        if (users && users.length > 0) {
          setName(users[0].name)
          setUsername(users[0].username)
          if (users[0].school_id) {
            setSchoolId(users[0].school_id)
            setSchoolName(await getSchoolName(users[0].school_id));
            console.log(schoolId)
            const page = parseInt(searchParam.get('page') || "0")
            console.log("page: " + page);
            setPage(page);
            const { from, to } = getPagination(page, 3);
            const { data: posts, error } = await supabase.from('posts').select("*").eq('school_id', users[0].school_id).order('timestamp', { ascending: false }).range(from, to);
            setLatestPosts(posts);
            console.log(posts)
          }
          else {
            push("https://google.com") // Do something about it later. For users who didn't have school yet
          }
        } else {
          push("/onboard");
        }
      }
    };

    fetchSession();
  }, []);

  return (
    <>
      {/* {email} {userid} */}
      Welcome {name} (@{username}){schoolName ? " " + "(" + schoolName + ")" : ""}!
      <br />Recent Posts <br />
      {latestPosts.length > 0 ? latestPosts.map(post =>
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
      ) : "No post left :)"}
      <br />
      {latestPosts && latestPosts.length == 3 && <a href={"/users/" + name + "?page=" + (page + 1)}>Go to next page</a>}
      {latestPosts && page != 0 && <a href={"/users/" + name + "?page=" + (page - 1)}>Go to before bage</a>}
    </>
  )
}
