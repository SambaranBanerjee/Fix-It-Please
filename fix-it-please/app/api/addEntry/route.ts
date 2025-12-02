import dbConnect from "@/lib/dbConnect";
import Entry from "@/model/entryModel"; 
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

        await dbConnect();

        const { title, type, solution } = await request.json();

        // We must check if 'type' is an array and if it has items.
        // '!type' alone won't catch an empty array []
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