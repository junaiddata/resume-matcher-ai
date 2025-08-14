'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { UserCircle } from 'lucide-react'; // You can use any icon here

export default function Landing() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || '';

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-blue-800">Home</h1>

        <div className="flex items-center gap-4">
          {!session ? (
            <>
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Login
              </button>
              <Link href="/signup">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Signup
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <div className="flex items-center gap-2 cursor-pointer hover:underline text-blue-800">
                  <UserCircle className="w-6 h-6" />
                  <span>{userEmail}</span>
                </div>
              </Link>

              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Info */}
      <section className="text-center max-w-2xl">
        <h2 className="text-4xl font-bold mb-4">Sales Order</h2>
        <p className="text-lg text-gray-700 mb-8">
          Upload CO and paste CO descriptions to instantly get match scores using AI.
          Ideal for CO, CO, and CO teams.
        </p>

        <Link href={session ? "/matcher" : "#"}>
          <button
            className={`px-6 py-3 text-lg rounded-xl shadow transition ${
              session
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!session}
          >
            Get Started
          </button>
        </Link>
      </section>
    </main>
  );
}
