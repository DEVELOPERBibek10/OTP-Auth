import { z } from "zod";

export const signUpSchema = z.object({
  body: z.object({
    email: z
      .email()
      .toLowerCase()
      .trim()
      .min(1, { error: "Email is required." })
      .max(56, { error: "Invalid email address." }),
    username: z
      .string()
      .trim()
      .min(3, { error: "Username must be at least 3 characters" })
      .max(20, { error: "Username cannot be more than 20 characters." }),
  }),
});

export const signInSchema = z.object({
  body: z.object({
    email: z
      .email()
      .toLowerCase()
      .trim()
      .min(1, { error: "Email is required." })
      .max(56, { error: "Invalid email address." }),
  }),
});

export const verifySignInOrUpSchema = z.object({
  body: z.object({
    email: z
      .email()
      .toLowerCase()
      .trim()
      .min(1, { error: "Email is required." })
      .max(56, { error: "Invalid email address." }),
    otp: z.coerce
      .number({ error: "Must be a valid number." })
      .min(100000, { error: "6 digit OTP is expected." })
      .max(999999, { error: "6 digit OTP is expected." }),
  }),
});

export type SignUpUser = z.infer<typeof signUpSchema>["body"];
export type SignInUser = z.infer<typeof signInSchema>["body"];
export type VerifySignInOrUp = z.infer<typeof verifySignInOrUpSchema>["body"];
