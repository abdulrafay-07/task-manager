import { z } from "zod";

export const createTaskSchema = z.object({
   title: z.string().min(3, "title must be at least 3 characters long."),
   description: z.string().min(8, "Description must be at least 8 characters long."),
   status: z.enum(["not_started", "in_progress", "done"])
});