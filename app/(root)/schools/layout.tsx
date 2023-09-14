import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <div className="flex w-full">
    <div className="flex-[2]"></div>
    <div className="flex-[5]">{children}</div>
    <div className="flex-[2]"></div>
  </div>);
}
