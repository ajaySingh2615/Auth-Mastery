import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .toLowerCase()
    .pipe(z.email({ message: "Please provide a valid email" })),

  password: z.string().min(1, "Password is required"),
  // Note: min(1) not min(8) — we don't tell attackers what the password rules are
  // If we said "min 8 characters", an attacker knows part of your validation
  // Just check if it's present — the DB will reject wrong passwords anyway
});

export type LoginDto = z.infer<typeof loginSchema>;
