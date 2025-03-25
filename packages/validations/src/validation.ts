import { z } from "zod";

// SignUp validation schema
export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .trim(),
  email: z.string().email("Invalid email address").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long")
    .trim(),
});

// Type of SignUp schema
export type SignUpSchemaType = z.infer<typeof signUpSchema>;

// SignIn validation schema
export const signInSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long")
    .trim(),
});

// Type of SignIn schema
export type SignInSchemaType = z.infer<typeof signInSchema>;

// Add Task validation schema
export const addTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").trim(),
  description: z.string().trim().optional(),
});

// Type of Add Task schema
export type AddTaskSchemaType = z.infer<typeof addTaskSchema>;

// Update Task validation schema
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .trim()
    .optional(),
  description: z.string().trim().optional(),
  completed: z.boolean().optional(),
});

// Type of Update Task schema
export type UpdateTaskSchemaType = z.infer<typeof updateTaskSchema>;
