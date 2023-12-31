"use client";
import { pinning, checkadmin } from "@/lib/actions/updateUser.action";
import { useState, useEffect } from "react";
export function PinPost({ postid }: { postid: string }) {
    const [isadmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await checkadmin(postid).then(isAdmin => {
                    setIsAdmin(isAdmin);
                });
            } catch (error) {
                throw error
            }
        };

        fetchData();
    }, [postid]);
    return (
        <div
            style={{ display: isadmin ? "flex" : "none" }}
            onClick={() => {
                pinning(postid).then(() => alert("Post Pinned!"));
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="fill-pri"
            >
                <path d="M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"/>
            </svg>
        </div>
    );
}
