'use client';
import Image, { ImageProps } from 'next/image'
import Post from '@/stories/Post'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react';
import type { Database } from '@/supabase.types'
import { useRouter, useSearchParams } from 'next/navigation'
import { getPfpUrl } from '@/lib/getPfpUrl';
import { getLike } from '@/lib/newlike';

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
  const [userData, setUserData] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [likeStatus, setLikeStatus] = useState([]);

  const router = useRouter();
  const page = parseInt(useSearchParams().get("page") || "0");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error(error);
        router.push("/onboard");
        return;
      }

      setUserData(user);

      if (!user.school_id) {
        router.push("https://google.com"); // Redirect to a default page for users who haven't set their school
        return;
      }

      const { data: school } = await supabase
        .from("schools")
        .select("name")
        .eq("id", user.school_id)
        .single();

      if (school) {
        setUserData((prevUserData) => ({ ...prevUserData, schoolName: school.name }));
      }
      const { from, to } = getPagination(page, 3)
      const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .eq("school_id", user.school_id)
        .order("timestamp", { ascending: false })
        .range(from, to)

      if (posts) {
        setLatestPosts(posts);

        const postLikeStatus = await Promise.all(
          posts.map(async (post) => {
            const { data: liked } = await supabase
              .from("likes")
              .select("*")
              .match({ user_id: user.id, post_id: post.id });

            // Check if a like status exists for the post
            const isLiked = liked && liked.length > 0;
            console.log(post.id, isLiked);
            return { id: post.id, likestatus: isLiked };
          })
        );
        console.log(postLikeStatus)
        setLikeStatus(postLikeStatus);
      }
    };

    fetchUserData();
  }, []);

  const handleLikeToggle = async (postId) => {
    const currentLikeStatus = likeStatus.find((item) => item.id === postId)?.likestatus;
    const newLikeStatus = currentLikeStatus ? false : true;

    setLikeStatus((prevLikeStatus) => {
      const updatedLikeStatus = prevLikeStatus.map((item) => {
        if (item.id === postId) {
          return { ...item, likestatus: newLikeStatus };
        }
        return item;
      });
      return updatedLikeStatus;
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    if (newLikeStatus) {
      const { data, error } = await supabase
        .from("likes")
        .insert([{ user_id: session.user.id, post_id: postId }]);
      if (error) {
        console.error(error);
      }
    } else {
      const { data, error } = await supabase
        .from("likes")
        .delete()
        .match({ user_id: session.user.id, post_id: postId });
      if (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {userData && (
        <>
          Welcome {userData.name} (@{userData.username}) {userData.schoolName && `(${userData.schoolName})`}!
          <br />
          Recent Posts <br />
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  overflowX: "auto",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    marginRight: "15px",
                    position: "relative",
                  }}
                >
                  <ImageWithFallback
                    src={getPfpUrl(post.user_id)}
                    alt="Profile Image"
                    style={{ objectFit: "cover" }}
                    fallbackSrc='/uwoog.png'
                    fill={true}
                  />
                </div>
                <div style={{ maxWidth: "70%" }}>{post.content}</div>
                <div
                  onClick={() => handleLikeToggle(post.id)}
                  style={{ cursor: "pointer" }}
                >
                  Like: {likeStatus.find(item => item.id == post.id)?.likestatus ? "Yes" : "No"}
                </div>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
          {latestPosts && latestPosts.length == 3 && <a href={"/?page=" + (page + 1)}>Go to next page</a>}
          {latestPosts && page != 0 && <a href={"/?page=" + (page - 1)}>Go to before bage</a>}
        </>
      )}
    </>
  );
}
