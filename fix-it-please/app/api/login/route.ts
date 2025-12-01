import dbConnect from "@/lib/dbConnect";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const {email,password} = await request.json();
        if (!email || !password) {
            return NextResponse.json(
                {message: "Email and Password are required"},
            {status: 400}
            );
        }

        const user = await User.findOne({
            email: email,
        })

        if (!user) {
            return NextResponse.json(
                {message: "User nt found"},
                {status: 404}
            )
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                {message: "Invalid credentials"},
                {status: 401}
            )
        }
        return NextResponse.json(
            {message: "Login successful"},
            {status: 200}
        );
    } catch (error) {
        console.error("Error in user login:", error);
        return NextResponse.json(
            {message:"Internal Server Error"},
            {status: 500}
        );
    }
}