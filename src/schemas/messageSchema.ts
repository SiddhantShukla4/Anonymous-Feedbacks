import {z} from 'zod';

export const MessageSchema = z.object({
  content:z.string().min(10,"Message must be at least 10 character")
  .max(300,"Message must be at most 300 character")
})