import dbConnect from "@/lib/dbConnect";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const {email, password} = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                {message: "Email and Password are required"},
            {status: 400}
            );
        }

        const existingUser = await User.findOne({
            email: email
        })

        if (existingUser) {
            return NextResponse.json(
                {message: "User already exists"},
                {status: 409}
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            email,
            password: hashedPassword,
        })

        return NextResponse.json(
            {message: "User created successfully"},
            {status: 201}
        )
    } 
    catch (error) {
        console.error("Error in user registration:", error);
        return NextResponse.json(
            {message:"Internal Server Error"},
            {status: 500}
        );
    }
}