"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;
      const res = await fetch(`http://18.143.206.136/flaskapp/profile?email=${session.user.email}`);
      const data = await res.json();
      setProfile(data);
    };

    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>Please login to view your profile.</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-lg"><strong>Email:</strong> {session.user?.email}</p>
        <p className="text-lg"><strong>Matches Left:</strong> {profile.remaining ?? 0}</p>

        <Link href="/plans">
          <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Upgrade Plan
          </button>
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Match History</h2>
        {profile.history?.length > 0 ? (
          <ul className="space-y-3">
            {profile.history.map((entry: any, idx: number) => (
              <li key={idx} className="border p-3 rounded shadow-sm">
                <p><strong>Resume:</strong> {entry.resume_name}</p>
                <p><strong>Score:</strong> {entry.score}%</p>
                <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No match history found.</p>
        )}
      </div>
    </main>
  );
}
