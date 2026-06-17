"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SolutionDiscussion from "@/components/SolutionDiscussion";

interface Query {
  _id: string;
  title: string;
  type: string[];
  solution: string;
  createdAt: string;
}

export default function ViewAQuery() {
  const router = useRouter();

  const params = useParams<{ id: string }>();
  const id = params?.id;

  /*
    We use Query | null instead of Query[] because this page
    fetches one individual query rather than a collection.
  */
  const [query, setQuery] = useState<Query | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [copyStatus, setCopyStatus] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!id) {
      setError("No query ID was provided.");
      setIsLoading(false);
      return;
    }

    // Cancels the request if the component unmounts.
    const controller = new AbortController();

    const getQuery = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching query with ID:", id);

        const response = await fetch(`/api/entry/${id}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch query"
          );
        }

        if (!data.entry) {
          throw new Error("Query was not found");
        }

        setQuery(data.entry);
      } catch (error) {
        // Do not display an error when the request was
        // deliberately cancelled during component cleanup.
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Error fetching query:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load data. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    getQuery();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleCopySolution = async () => {
    if (!query) {
      return;
    }

    try {
      await navigator.clipboard.writeText(query.solution);

      setCopyStatus("Solution copied!");

      window.setTimeout(() => {
        setCopyStatus(null);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy solution:", error);

      setCopyStatus("Could not copy solution.");

      window.setTimeout(() => {
        setCopyStatus(null);
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e2729] text-[#F7BD03]">
        Loading details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#1e2729] text-white">
        <p className="text-red-400">{error}</p>

        <button
          type="button"
          onClick={() =>
            router.push("/pages/view-queries")
          }
          className="text-[#F7BD03] underline"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#1e2729] text-white">
        <p className="text-gray-400">
          Query not found.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push("/pages/view-queries")
          }
          className="text-[#F7BD03] underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const createdAt = new Date(query.createdAt);

  return (
    <main className="min-h-screen w-full bg-[#1e2729] p-4 md:p-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header and back button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Go back to all queries"
            onClick={() =>
              router.push("/pages/view-queries")
            }
            className="rounded-full border border-gray-700 bg-black p-2 text-[#F7BD03] transition-colors hover:bg-[#F7BD03] hover:text-black"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Query Details
          </h2>
        </div>

        {/* Main solution card */}
        <article className="overflow-hidden rounded-xl border border-gray-800 bg-black shadow-2xl">
          {/* Title section */}
          <header className="border-b border-gray-800 bg-gradient-to-r from-black to-[#0a0a0a] p-6 md:p-8">
            <div className="mb-4 flex flex-wrap gap-3">
              {query.type.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-full bg-[#F7BD03] px-3 py-1 text-xs font-bold text-[#1e2729] shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-serif text-3xl font-extrabold leading-tight text-[#F7BD03] md:text-4xl">
              {query.title}
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              Logged on{" "}
              {createdAt.toLocaleDateString()} at{" "}
              {createdAt.toLocaleTimeString()}
            </p>
          </header>

          {/* Solution section */}
          <section className="space-y-4 p-6 md:p-8">
            <h3 className="border-l-4 border-[#F7BD03] pl-3 text-lg font-semibold uppercase tracking-wider text-white">
              Solution / Implementation
            </h3>

            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#F7BD03] to-[#1e2729] opacity-10 blur transition duration-200 group-hover:opacity-20" />

              <div className="relative overflow-x-auto rounded-lg border border-gray-700 bg-[#1e2729] p-6">
                <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-gray-200">
                  {query.solution}
                </pre>
              </div>
            </div>
          </section>

          {/* Footer actions */}
          <footer className="flex flex-wrap items-center justify-end gap-4 border-t border-gray-800 bg-[#0a0a0a] p-6">
            {copyStatus && (
              <span
                role="status"
                aria-live="polite"
                className="text-sm text-[#F7BD03]"
              >
                {copyStatus}
              </span>
            )}

            <button
              type="button"
              onClick={handleCopySolution}
              className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>

              Copy solution
            </button>
          </footer>
        </article>

        {/* Likes, dislikes and community replies */}
        <SolutionDiscussion entryId={query._id} />
      </div>
    </main>
  );
}