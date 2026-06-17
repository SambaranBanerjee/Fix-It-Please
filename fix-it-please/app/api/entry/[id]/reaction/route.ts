import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/dbConnect";
import Reaction from "@/model/reaction";

import {auth} from "@/auth";
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id: entryId } = await context.params;
    const body = await request.json();

    const type = body.type as "like" | "dislike";

    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return NextResponse.json(
        { message: "Invalid entry ID" },
        { status: 400 }
      );
    }

    if (!["like", "dislike"].includes(type)) {
      return NextResponse.json(
        { message: "Reaction must be like or dislike" },
        { status: 400 }
      );
    }

    /*
      Replace this with the authenticated user's ID.

      Examples:
      const session = await auth();
      const userId = session?.user?.id;

      Do not accept userId directly from the frontend in production.
    */
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const currentReaction = await Reaction.findOne({
      entryId,
      userId,
    });

    let userReaction: "like" | "dislike" | null = type;

    if (!currentReaction) {
      // User has not reacted before.
      await Reaction.create({
        entryId,
        userId,
        type,
      });
    } else if (currentReaction.type === type) {
      // Clicking the same button again removes the reaction.
      await currentReaction.deleteOne();
      userReaction = null;
    } else {
      // Like becomes dislike, or dislike becomes like.
      currentReaction.type = type;
      await currentReaction.save();
    }

    const [likes, dislikes] = await Promise.all([
      Reaction.countDocuments({
        entryId,
        type: "like",
      }),
      Reaction.countDocuments({
        entryId,
        type: "dislike",
      }),
    ]);

    return NextResponse.json({
      likes,
      dislikes,
      userReaction,
    });
  } catch (error) {
    console.error("Reaction API error:", error);

    return NextResponse.json(
      { message: "Unable to update reaction" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id: entryId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return NextResponse.json(
        { message: "Invalid entry ID" },
        { status: 400 }
      );
    }

    const userId = request.headers.get("x-user-id");

    const [likes, dislikes, existingReaction] = await Promise.all([
      Reaction.countDocuments({
        entryId,
        type: "like",
      }),

      Reaction.countDocuments({
        entryId,
        type: "dislike",
      }),

      userId && mongoose.Types.ObjectId.isValid(userId)
        ? Reaction.findOne({ entryId, userId }).lean()
        : Promise.resolve(null),
    ]);

    return NextResponse.json({
      likes,
      dislikes,
      userReaction: existingReaction?.type ?? null,
    });
  } catch (error) {
    console.error("Fetching reactions failed:", error);

    return NextResponse.json(
      { message: "Unable to load reactions" },
      { status: 500 }
    );
  }
}