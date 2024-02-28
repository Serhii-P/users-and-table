"use client";
import UsersTable from "@/components/UsersTable";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      return redirect("/login");
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  return (
    <div>
      {/* uncomment this block if you need to log out */}
      {/* {status === "authenticated" && (
        <button onClick={() => signOut()}>Log out</button>
      )} */}
      <UsersTable />
    </div>
  );
}
