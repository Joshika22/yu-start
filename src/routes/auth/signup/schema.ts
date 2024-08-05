import { z } from 'zod';

export const signupFormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
	email: z.string().email(),
	password: z.string().min(8),
	confirmPassword: z.string().min(8)
});