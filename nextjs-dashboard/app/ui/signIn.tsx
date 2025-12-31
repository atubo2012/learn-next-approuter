'use client';

import { signInWithGoogle } from '@/app/lib/actions';

export default function SignInGoogle() {
  return (
    <form action={signInWithGoogle}>
      <button 
        type="submit"
        className="flex h-10 w-full items-center justify-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        Sign in with Google
      </button>
    </form>
  );
}