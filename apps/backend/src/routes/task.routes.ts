// Task routes //
import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllers/tasks.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Create a new router
const taskRouter = Router();

// Apply auth middleware
taskRouter.use(authMiddleware);

// POST /api/task/create-task
taskRouter.post("/create-task", createTask);

// GET /api/task/get-all-tasks
taskRouter.get("/get-all-tasks", getAllTasks);

// GET /api/task/get-task/:id
taskRouter.get("/get-task/:id", getTask);

// PUT /api/task/update-task/:id
taskRouter.put("/update-task/:id", updateTask);

// DELETE /api/task/delete-task/:id
taskRouter.delete("/delete-task/:id", deleteTask);

// Export the router
export default taskRouter;
