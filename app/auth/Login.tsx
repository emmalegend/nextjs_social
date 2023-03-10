"use client";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <li>
      <button
        onClick={() => signIn()}
        className='text-sm bg-gray-700 text-white py-2 px-6 disabled:opacity-25 rounded-xl'
      >
        Sign In
      </button>
    </li>
  );
}