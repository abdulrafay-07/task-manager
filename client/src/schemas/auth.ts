import { z } from "zod";

export const loginSchema = z.object({
   email: z.string().email("Enter a valid email address."),
   password: z.string().min(6, "Password must be at least 6 characters long.")
});

export const signUpSchema = z.object({
   name: z.string().min(3, "Name must be at least 3 characters long."),
   email: z.string().email("Enter a valid email address."),
   password: z.string().min(6, "Password must be at least 6 characters long.")
});