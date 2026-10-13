import { z } from 'zod';

export const loginDataSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    // expectedResult: z.enum(['success', 'failure']),
});

export type LoginData = z.infer<typeof loginDataSchema>;