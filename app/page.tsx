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
  const [userid, setUserid] = useState("");
  const [name, setName] = useState("");
  const { push } = useRouter();
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
        //@ts-ignore
        if (users && users.length > 0) {
          setName(users[0].name)
          setUsername(users[0].username)
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
      Welcome {name} (@{username})!
    </>
  )
}
