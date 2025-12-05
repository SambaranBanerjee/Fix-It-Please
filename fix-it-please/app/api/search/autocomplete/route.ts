import dbConnect from "@/lib/dbConnect";
import Entry from "@/model/entryModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json({ suggestions: [] });
    }

    try {
        await dbConnect();

        // MongoDB Regex Search for Autocomplete
        // $regex with 'i' flag makes it case-insensitive
        const suggestions = await Entry.find({
            title: { $regex: query, $options: 'i' }
        })
        .select("_id title") // Optimization: Only fetch ID and Title
        .limit(5);           // Limit to 5 suggestions

        // Map to match the frontend expectation { id, title }
        const formattedSuggestions = suggestions.map(doc => ({
            id: doc._id.toString(),
            title: doc.title
        }));

        return NextResponse.json({ suggestions: formattedSuggestions }, { status: 200 });

    } catch (error) {
        console.error("MongoDB Autocomplete Error:", error);
        return NextResponse.json({ suggestions: [] }, { status: 500 });
    }
}