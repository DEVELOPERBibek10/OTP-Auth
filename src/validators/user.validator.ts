import { z } from "zod";

export const signUpSchema = z.object({
  body: z.object({
    email: z
      .email()
      .toLowerCase()
      .trim()
      .min(1, { error: "Email is required." }),

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
      .min(1, { error: "Email is required." }),
  }),
});

export type SignUpUser = z.infer<typeof signUpSchema>["body"];
export type SignInUser = z.infer<typeof signInSchema>["body"];
