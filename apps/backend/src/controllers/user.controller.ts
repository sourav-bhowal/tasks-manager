// User Controllers //
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import prisma from "@repo/database/prisma";
import { signInSchema, signUpSchema } from "@repo/validations/src/validation";

// Sign Up Controller
export const signUpUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Validate request body
    const { error, success, data } = signUpSchema.safeParse(request.body);

    // If validation fails, throw an error
    if (!success) {
      throw new apiError(400, error?.errors[0]?.message);
    }

    // Destructure request body
    const { username, email, password } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    // If user exists, throw an error
    if (existingUser) {
      throw new apiError(
        400,
        "User with this email or username already exists."
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // If user is not created, throw an error
    if (!newUser) {
      throw new apiError(400, "User could not be created.");
    }

    // Send response
    response
      .status(201)
      .json(new apiResponse(201, null, "User created successfully."));
  }
);

// Sign In Controller
export const signInUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Parse request body
    const { success, error, data } = signInSchema.safeParse(request.body);

    // If validation fails, throw an error
    if (!success) {
      throw new apiError(400, error?.errors[0]?.message);
    }

    // Destructure request body
    const { email, password } = data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user does not exist, throw an error
    if (!user) {
      throw new apiError(400, "Invalid credentials or user does not exist.");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid, throw an error
    if (!isPasswordValid) {
      throw new apiError(400, "Invalid credentials.");
    }

    // Generate JWT Access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );

    // Set cookie
    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800000, // 7 days
    });

    // Send response
    response.status(200).json(
      new apiResponse(
        200,
        {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            accessToken,
          },
        },
        "User signed in successfully."
      )
    );
  }
);
