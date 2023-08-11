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
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  var x = useRef<any>(null);
  const { push, refresh } = useRouter();

  async function upsertUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData);
    if (error) {
      console.error('Error upserting user:', error);
    }
    else {
      refresh()
    }
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if a profile image is selected
    if (profileImage) {
      const fileName = `${userid}/pfp`; // This will be the file name in Supabase storage

      // Upload file to Supabase storage
      let { error: uploadError } = await supabase.storage.from("images").upload(fileName, profileImage, { upsert: true });

      if (uploadError) {
        if (uploadError.message == 'The resource already exists') {

          if (uploadError) {
            console.error("Error replacing image:", uploadError);
          }
        }
        else {
          console.error("Error uploading image:", uploadError);
        }
      }

    }
    x.current = { ...x.current, username: username, name: name };
    const userData = {
      id: userid,
      username: username,
      name: name
    };

    await upsertUser(userData);
  };
  const handleFileChange = (event) => {
    const imageFile = event.target.files[0]; // Only one file can be selected
    setProfileImage(imageFile);
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
          setName(user[0].name)
        } else {
          x.current = null;  // Set the x value to null
          // Upsert new user data
          await upsertUser({ id: fetchedSession.user.id, email: fetchedSession.user.email });
        }

        console.log("start");
        console.log(user);
        console.log(x.current);  // Now this should log the user or null
        console.log(error);
        console.log("end");
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
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} required />
        </label>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} required />
        </label>
        <label>
          Profile Picture:
          <input type="file" id="profileImage" onChange={handleFileChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}
