import z from "zod";

export const loginSchema = z.object({
  email: z.email("Must be a valid email").min(1, "Email is required"),
  password: z
    .string("Must be a valid password")
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export const signupSchema = loginSchema.extend({
  name: z
    .string("Must be a valid name")
    .min(2, "Name must be at least 2 characters long"),
  confirmPassword: z
    .string("Must be a valid password")
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export type AuthLoginData = z.infer<typeof loginSchema>;
export type AuthSignupData = z.infer<typeof signupSchema>;
