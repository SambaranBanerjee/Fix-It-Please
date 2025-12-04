import dbConnect from "@/lib/dbConnect";
import Entry from "@/model/entryModel";
import { NextResponse } from "next/server";

export async function GET(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        
        const { id } = await params;
        console.log("API Hit. ID received:", id);
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
             return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }

        const entry = await Entry.findById(id);

        if (!entry) {
            return NextResponse.json(
                { message: "Entry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { entry },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching single entry:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}