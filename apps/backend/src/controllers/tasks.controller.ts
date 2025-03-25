// Tasks Controller //
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addTaskSchema,
  updateTaskSchema,
} from "@repo/validations/src/validation";
import apiError from "../utils/apiError.js";
import prisma from "@repo/database/prisma";
import apiResponse from "../utils/apiResponse.js";

// Create a new task controller
export const createTask = asyncHandler(
  async (request: Request, response: Response) => {
    // Validate request body
    const { error, success, data } = addTaskSchema.safeParse(request.body);

    // If validation fails, throw an error
    if (!success) {
      response
        .status(400)
        .json(new apiResponse(400, null, error?.errors[0]?.message));

      throw new apiError(400, error?.errors[0]?.message);
    }

    // Destructure request body
    const { title, description } = data;

    // Create a new task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId: request.user.id,
      },
    });

    // If task is not created, throw an error
    if (!newTask) {
      response
        .status(500)
        .json(new apiResponse(500, null, "Task could not be created."));

      throw new apiError(400, "Task could not be created.");
    }

    // Send the response
    response
      .status(201)
      .json(new apiResponse(201, newTask, "Task created successfully."));
  }
);

// Get all tasks controller
export const getAllTasks = asyncHandler(
  async (request: Request, response: Response) => {
    // Get all tasks
    const tasks = await prisma.task.findMany({
      where: {
        userId: request.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Send the response
    response
      .status(200)
      .json(new apiResponse(200, tasks, "Tasks fetched successfully."));
  }
);

// Get a single task controller
export const getTask = asyncHandler(
  async (request: Request, response: Response) => {
    // Get task id from request params
    const { id } = request.params;

    // Get a single task
    const task = await prisma.task.findUnique({
      where: {
        id,
        userId: request.user.id,
      },
    });

    // If task is not found, throw an error
    if (!task) {
      throw new apiError(404, "Task not found.");
    }

    // Send the response
    response
      .status(200)
      .json(new apiResponse(200, task, "Task fetched successfully."));
  }
);

// Update a task controller
export const updateTask = asyncHandler(
  async (request: Request, response: Response) => {
    // Get task id from request params
    const { id } = request.params;

    // Validate request body
    const { error, success, data } = updateTaskSchema.safeParse(request.body);

    // If validation fails, throw an error
    if (!success) {
      throw new apiError(400, error?.errors[0]?.message);
    }

    // Destructure request body
    const { title, description, completed } = data;

    // Update a task
    const updatedTask = await prisma.task.update({
      where: {
        id,
        userId: request.user.id,
      },
      data: {
        title,
        description,
        completed,
      },
    });

    // If task is not updated, throw an error
    if (!updatedTask) {
      response
        .status(500)
        .json(new apiResponse(500, null, "Task could not be updated."));

      throw new apiError(400, "Task could not be updated.");
    }

    // Send the response
    response
      .status(200)
      .json(new apiResponse(200, updatedTask, "Task updated successfully."));
  }
);

// Delete a task controller
export const deleteTask = asyncHandler(
  async (request: Request, response: Response) => {
    // Get task id from request params
    const { id } = request.params;

    // Delete a task
    const deletedTask = await prisma.task.delete({
      where: {
        id,
        userId: request.user.id,
      },
    });

    // If task is not deleted, throw an error
    if (!deletedTask) {
      response
        .status(500)
        .json(new apiResponse(500, null, "Task could not be deleted."));

      throw new apiError(400, "Task could not be deleted.");
    }

    // Send the response
    response
      .status(200)
      .json(new apiResponse(200, null, "Task deleted successfully."));
  }
);
