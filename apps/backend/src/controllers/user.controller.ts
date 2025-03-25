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

    // If validation fails, throw an error and send response
    if (!success) {
      response
        .status(400)
        .json(new apiResponse(400, null, error?.errors[0]?.message));

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

    // If user exists, throw an error and send response
    if (existingUser) {
      response
        .status(409)
        .json(new apiResponse(409, null, "User already exists."));

      throw new apiError(400, "User already exists.");
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

    // If user is not created, throw an error and send response
    if (!newUser) {
      response
        .status(500)
        .json(new apiResponse(500, null, "User could not be created."));

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
      response
        .status(400)
        .json(new apiResponse(400, null, error?.errors[0]?.message));

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
      response
        .status(400)
        .json(
          new apiResponse(
            400,
            null,
            "Invalid credentials or user does not exist."
          )
        );
      throw new apiError(400, "Invalid credentials or user does not exist.");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid, throw an error
    if (!isPasswordValid) {
      response
        .status(400)
        .json(new apiResponse(400, null, "Invalid credentials."));
      throw new apiError(400, "Invalid credentials.");
    }

    // Generate JWT Access token
    const accessToken = jwt.sign(
      {
        id: user.id,
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

// Sign Out Controller
export const signOutUser = asyncHandler(
  async (request: Request, response: Response) => {
    // Clear cookie
    response.clearCookie("accessToken");

    // Send response
    response
      .status(200)
      .json(new apiResponse(200, null, "User signed out successfully."));
  }
);