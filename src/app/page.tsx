"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Story {
  id: number;
  title: string;
  by: string;
  score: number;
  descendants: number;
}

export default function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStoriesFromDB = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/stories?page=${page}&limit=${limit}`);
        // console.log('res', res.data.stories);

        setStories(res.data.stories);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load stories from database.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoriesFromDB();
  }, [page]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {loading && <p className="text-center mt-10">Loading...</p>}
      {error && <p className="text-center mt-10 text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <h1 className="text-2xl font-bold mb-6">Hacker News - Page {page}</h1>
          <ul className="space-y-4">
            {stories?.map((story) => (
              <li key={story.id} className="border-b pb-4">
                <Link
                  href={`/story/${story.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {story.title}
                </Link>
                <p className="text-sm text-gray-600">
                  By {story.by} | {story.score} points | {story.descendants ?? 0} comments
                </p>
              </li>
            ))}
          </ul>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-3 font-semibold">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
