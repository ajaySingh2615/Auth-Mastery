import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .toLowerCase() // transforms the value — "JOHN@gmail.com" → "john@gmail.com"
    .pipe(z.email({ message: "Please provide a valid email" })),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["customer", "seller"]).optional().default("customer"),
});

export type RegisterDto = z.infer<typeof registerSchema>;
