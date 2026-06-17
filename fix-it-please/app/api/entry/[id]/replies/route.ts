import {
  NextRequest,
  NextResponse,
} from "next/server";
import mongoose from "mongoose";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Reply from "@/model/reply";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await dbConnect();

    const { id: entryId } =
      await context.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        entryId
      )
    ) {
      return NextResponse.json(
        {
          message: "Invalid entry ID.",
        },
        {
          status: 400,
        }
      );
    }

    const replies = await Reply.find({
      entryId,
    })
      .populate({
        path: "userId",
        select: "name",
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      replies,
    });
  } catch (error) {
    console.error(
      "Fetching replies failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load replies.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "You must sign in before replying.",
        },
        {
          status: 401,
        }
      );
    }

    await dbConnect();

    const { id: entryId } =
      await context.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        entryId
      ) ||
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid entry or user ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (
      content.length < 2 ||
      content.length > 2000
    ) {
      return NextResponse.json(
        {
          message:
            "Reply must contain between 2 and 2000 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const createdReply =
      await Reply.create({
        entryId,
        userId,
        content,
      });

    const populatedReply =
      await Reply.findById(
        createdReply._id
      )
        .populate({
          path: "userId",
          select: "name",
        })
        .lean();

    return NextResponse.json(
      {
        reply: populatedReply,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Creating reply failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to create reply.",
      },
      {
        status: 500,
      }
    );
  }
}