"use client";

import { useEffect, useState } from "react";

export default function LivePage() {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    let mounted = true;

    const sendHeartbeat = async () => {
      await fetch("/api/presence/heartbeat", {
        method: "POST",
        cache: "no-store",
      }).catch(() => null);
    };

    const fetchCount = async () => {
      const res = await fetch("/api/presence/count", { cache: "no-store" }).catch(() => null);
      if (!res || !res.ok) return;
      const data = (await res.json()) as { activeUsers?: number };
      if (mounted) setActiveUsers(data.activeUsers ?? 0);
    };

    sendHeartbeat();
    fetchCount();

    const hb = window.setInterval(sendHeartbeat, 10_000);
    const poll = window.setInterval(fetchCount, 1_500);

    return () => {
      mounted = false;
      window.clearInterval(hb);
      window.clearInterval(poll);
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Live Audience Counter from local:</h1>
      <p className="mt-3 text-gray-600">Active users in the last 30 seconds</p>

      <div className="mt-8 rounded-2xl border p-8">
        <p className="text-sm text-gray-500">Current active users</p>
        <p className="mt-2 text-6xl font-extrabold">{activeUsers}</p>
      </div>
    </main>
  );
}