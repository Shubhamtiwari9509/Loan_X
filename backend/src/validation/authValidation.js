import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters")
});

export const adminRegisterSchema = registerSchema.extend({
  invitationCode: z
    .string({ required_error: "Admin invitation code is required" })
    .min(1, "Admin invitation code is required")
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password cannot be empty")
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .optional()
});
