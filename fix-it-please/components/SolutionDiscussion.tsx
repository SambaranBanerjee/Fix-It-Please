"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";

type ReactionType = "like" | "dislike" | null;

interface ReactionState {
  likes: number;
  dislikes: number;
  userReaction: ReactionType;
}

interface ReplyUser {
  _id: string;
  name: string;
}

interface Reply {
  _id: string;
  content: string;
  userId: ReplyUser;
  createdAt: string;
}

interface SolutionDiscussionProps {
  entryId: string;
}

export default function SolutionDiscussion({
  entryId,
}: SolutionDiscussionProps) {
  const [reactionState, setReactionState] =
    useState<ReactionState>({
      likes: 0,
      dislikes: 0,
      userReaction: null,
    });

  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isReacting, setIsReacting] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadDiscussion = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [reactionResponse, repliesResponse] =
        await Promise.all([
          fetch(`/api/entry/${entryId}/reaction`),
          fetch(`/api/entry/${entryId}/replies`),
        ]);

      if (!reactionResponse.ok || !repliesResponse.ok) {
        throw new Error("Failed to load discussion");
      }

      const reactionData = await reactionResponse.json();
      const repliesData = await repliesResponse.json();

      setReactionState(reactionData);
      setReplies(repliesData.replies ?? []);
    } catch (error) {
      console.error(error);
      setError("Could not load reactions and replies.");
    } finally {
      setIsLoading(false);
    }
  }, [entryId]);

  useEffect(() => {
    loadDiscussion();
  }, [loadDiscussion]);

  const handleReaction = async (
    type: Exclude<ReactionType, null>
  ) => {
    if (isReacting) {
      return;
    }

    try {
      setIsReacting(true);
      setError(null);

      const response = await fetch(
        `/api/entry/${entryId}/reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update reaction"
        );
      }

      setReactionState(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update reaction"
      );
    } finally {
      setIsReacting(false);
    }
  };

  const handleReplySubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const content = replyContent.trim();

    if (content.length < 2 || isSubmittingReply) {
      return;
    }

    try {
      setIsSubmittingReply(true);
      setError(null);

      const response = await fetch(
        `/api/entry/${entryId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit reply"
        );
      }

      setReplies((previousReplies) => [
        data.reply,
        ...previousReplies,
      ]);

      setReplyContent("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit reply"
      );
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (isLoading) {
    return (
      <section className="mt-10 rounded-xl border border-gray-800 bg-black p-6">
        <p className="text-[#F7BD03]">
          Loading discussion...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 space-y-8 rounded-xl border border-gray-800 bg-black p-6 shadow-2xl">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-[#F7BD03]">
          Was this solution helpful?
        </h2>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            disabled={isReacting}
            onClick={() => handleReaction("like")}
            aria-pressed={
              reactionState.userReaction === "like"
            }
            className={`rounded-lg border px-5 py-3 font-semibold transition ${
              reactionState.userReaction === "like"
                ? "border-green-400 bg-green-400/20 text-green-300"
                : "border-gray-700 bg-[#1e2729] text-gray-300 hover:border-green-400 hover:text-green-300"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            👍 Helpful ({reactionState.likes})
          </button>

          <button
            type="button"
            disabled={isReacting}
            onClick={() => handleReaction("dislike")}
            aria-pressed={
              reactionState.userReaction === "dislike"
            }
            className={`rounded-lg border px-5 py-3 font-semibold transition ${
              reactionState.userReaction === "dislike"
                ? "border-red-400 bg-red-400/20 text-red-300"
                : "border-gray-700 bg-[#1e2729] text-gray-300 hover:border-red-400 hover:text-red-300"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            👎 Not helpful ({reactionState.dislikes})
          </button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-[#F7BD03]">
          Share your experience
        </h2>

        <form
          onSubmit={handleReplySubmit}
          className="space-y-3"
        >
          <label
            htmlFor="reply"
            className="block text-sm font-medium text-gray-300"
          >
            Did this solution work for you?
          </label>

          <textarea
            id="reply"
            value={replyContent}
            onChange={(event) =>
              setReplyContent(event.target.value)
            }
            rows={4}
            maxLength={2000}
            placeholder="Describe what worked, what did not work, or any additional steps you tried..."
            className="w-full resize-y rounded-lg border border-gray-700 bg-[#1e2729] p-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#F7BD03] focus:ring-1 focus:ring-[#F7BD03]"
          />

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-500">
              {replyContent.length}/2000
            </span>

            <button
              type="submit"
              disabled={
                replyContent.trim().length < 2 ||
                isSubmittingReply
              }
              className="rounded-lg bg-[#F7BD03] px-5 py-2 font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmittingReply
                ? "Posting..."
                : "Post experience"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-red-300"
        >
          {error}
        </p>
      )}

      <div>
        <h2 className="mb-4 text-xl font-bold text-white">
          Community experiences ({replies.length})
        </h2>

        {replies.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-700 p-6 text-center text-gray-500">
            No experiences have been shared yet.
          </div>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => (
              <article
                key={reply._id}
                className="rounded-lg border border-gray-800 bg-[#0d1112] p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-[#F7BD03]">
                    {reply.userId?.name ?? "User"}
                  </strong>

                  <time className="text-xs text-gray-500">
                    {new Date(
                      reply.createdAt
                    ).toLocaleString()}
                  </time>
                </div>

                <p className="whitespace-pre-wrap break-words text-gray-300">
                  {reply.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}