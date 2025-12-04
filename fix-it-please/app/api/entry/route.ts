import dbConnect from "@/lib/dbConnect";
import Entry from "@/model/entryModel"; 
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect();
        
        const { title, type, solution } = await request.json();

        if (!title || !solution || !type || (Array.isArray(type) && type.length === 0)) {
            return NextResponse.json(
                { message: "Title, Solution, and at least one Type are required" },
                { status: 400 }
            );
        }

        const newEntry = await Entry.create({
            title,
            type,
            solution,
        });

        return NextResponse.json(
            { 
                message: "Entry created successfully", 
                entry: newEntry 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating entry:", error);
        
        return NextResponse.json(
            { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );  
    }
}

export async function GET() {
    try {
        await dbConnect();
        const entries = await Entry.find().sort({ createdAt: -1 });
        if (entries.length === 0) {
            return NextResponse.json(
                {message: 'No entries found'},
                {status: 404}
            )
        }
        else {
            return NextResponse.json(
                { entries },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error fetching entries:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}