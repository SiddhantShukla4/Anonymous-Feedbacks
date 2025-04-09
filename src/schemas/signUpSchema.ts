import {z} from 'zod';
 
export const usernameValidation =z.string().min(3,"username must be at least 3 characters")
.max(20,"username must be at most 20 characters").regex(/^[a-zA-Z0-9_]*$/,"username must contain only letters, numbers and underscores")


export const signUpSchema =z.object({
    username : usernameValidation,
    email : z.string().email(),
    password : z.string().min(6,{message:"password must be at least 6 characters"}),
})