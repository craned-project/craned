"use client";
import { useRouter, usePathname } from 'next/navigation'
import { ReactNode } from 'react';
import Link from 'next/link';

export default function ActiveLink({ children, href }: { children: ReactNode, href: string }) {
    const router = useRouter()
    const pathName = usePathname();

    const handleClick = (e: any) => {
        e.preventDefault()
        if (pathName !== href)
            router.push(href)
    }

    return (
        <Link href={href} onClick={handleClick} style={{color: pathName === href ? "grey" : "black"}}>
            {children}
        </Link>
    )
}
