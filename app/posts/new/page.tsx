"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect, useRef } from 'react';

import type { Database } from '@/supabase.types'
import { useRouter } from 'next/navigation'
import { storageClient } from '@/lib/storage';

export default function OnBoard() {
  const supabase = createClientComponentClient<Database>();
  const [email, setEmail] = useState("");
  const [userid, setUserid] = useState("");
  const [username, setUsername] = useState("");
  const [school_id, setSchoolId] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [postData, setPostData] = useState("");
  const [name, setName] = useState("");
  var x = useRef<{
    bio: string | null
    id: string
    name: string
    school_id: string | null
    username: string
  }>(null);
  const { push, refresh } = useRouter();
  const createPost = async (post) => {
    const { error } = await supabase.from('posts').insert({
      user_id: userid,
      school_id,
      content: post
    })
  }
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await createPost(postData);
  };
  const handlePostData = (event) => {
    setPostData(event.target.value);
  }

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session: fetchedSession } } = await supabase.auth.getSession();
      if (!fetchedSession) {
        push("/login");
      } else {
        setEmail(fetchedSession.user.email);
        setUserid(fetchedSession.user.id);

        const { data: user, error } = await supabase
          .from('users')
          .select("*")
          .eq('id', fetchedSession.user.id);

        if (user && user.length > 0) {
          x.current = user[0];  // Set the x value to the user
          setUsername(user[0].username)
          setSchoolId(user[0].school_id)
        } else {
          push("/onboard")
        }
      }
    };

    fetchSession();
  }, []);


  return (
    <>
      test? {email} {userid} {
        x.current ? x.current.username :
          "Continue setup to use craned"
      }
      <form onSubmit={handleFormSubmit}>
        {/* <label>
          Bio:
          <input type="text" value={bio == null ? "" : bio} onChange={handleBio} />
        </label>
        <label>
          Profile Picture:
          <input type="file" id="profileImage" onChange={handleFileChange} />
        </label> */}
        <label>
          Post data:
          <textarea value={postData} onChange={handlePostData}></textarea>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}
