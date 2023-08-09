"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react';

import type { Database } from '@/supabase.types'

export default function Home() {
  const supabase = createClientComponentClient<Database>();
  const [email, setEmail] = useState("");
  const [userid, setUserid] = useState("");
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session: fetchedSession } } = await supabase.auth.getSession();
      if (fetchedSession) { }
      else {
        console.log("o nyo")
      }
      if (fetchedSession) {
        //@ts-ignore
        setEmail(fetchedSession.user.email);
        setUserid(fetchedSession.user.id);
      }
    };

    fetchSession();
  }, []);

  return (
    <>
      test? {email} {userid}
    </>
  )
}
