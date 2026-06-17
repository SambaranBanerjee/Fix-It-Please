"use client";

import Link from "next/link";
import {
  signOut,
  useSession,
} from "next-auth/react";

export default function AuthButtons() {
  const {
    data: session,
    status,
  } = useSession();

  if (status === "loading") {
    return (
      <span className="text-sm text-gray-400">
        Loading...
      </span>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/pages/login"
          className="rounded-lg border border-[#F7BD03] px-4 py-2 font-semibold text-[#F7BD03]"
        >
          Sign in
        </Link>

        <Link
          href="/pages/register"
          className="rounded-lg bg-[#F7BD03] px-4 py-2 font-semibold text-black"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-300">
        {session.user.name}
      </span>

      <button
        type="button"
        onClick={() =>
          signOut({
            callbackUrl:
              "/pages/landing",
          })
        }
        className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-[#F7BD03] hover:text-[#F7BD03]"
      >
        Sign out
      </button>
    </div>
  );
}