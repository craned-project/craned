"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react';

import type { Database } from '@/supabase.types'
import { useRouter } from 'next/navigation'
import { storageClient } from '@/lib/storage';

export default function OnBoard() {
  const supabase = createClientComponentClient<Database>();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [userid, setUserid] = useState("");
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
    </>
  )
}
