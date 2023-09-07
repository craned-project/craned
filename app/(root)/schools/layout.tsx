"use client";
import { useOrganization } from '@clerk/nextjs';
import { useState } from 'react';
import { redirect } from 'next/navigation';
export default function layout() {
    const { organization, membership } = useOrganization();
    if (membership.role !== "admin") {
        redirect("/");
    }
    else {
        return <></>
    }
}
