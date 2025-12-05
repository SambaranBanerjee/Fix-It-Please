import dbConnect from "@/lib/dbConnect";
import Entry from "@/model/entryModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!q) {
        return NextResponse.json({ results: [], total: 0 });
    }

    // Pagination: Calculate how many documents to skip
    const skip = (page - 1) * limit;

    try {
        await dbConnect();

        // Create a case-insensitive regex
        const regex = new RegExp(q, 'i');

        // Search logic: Match Title OR Tags OR Solution
        const searchCriteria = {
            $or: [
                { title: { $regex: regex } },
                { type: { $in: [regex] } }, // Checks if any string in the 'type' array matches
                { solution: { $regex: regex } }
            ]
        };

        // Run query and count in parallel for performance
        const [results, total] = await Promise.all([
            Entry.find(searchCriteria)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }), // Sort by newest
            Entry.countDocuments(searchCriteria)
        ]);

        return NextResponse.json({ 
            results, 
            total, 
            page, 
            limit 
        }, { status: 200 });

    } catch (error) {
        console.error("MongoDB Search Error:", error);
        return NextResponse.json({ results: [], total: 0 }, { status: 500 });
    }
}