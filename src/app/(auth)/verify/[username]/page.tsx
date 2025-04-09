"use client"
import { signUpSchema } from '@/schemas/signUpSchema'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { z } from 'zod'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'

const VerifyAccount = () => {
   
    const params = useParams<{ username: string }>()
    const router = useRouter() 
   
    
    

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })


    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })

            toast.success(response.data.message)
          
                router.replace('/sign-in')  
              
        } catch (error) {
            console.error("Error in sending otp", error)
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(`SignUp Failed: ${axiosError.response?.data.message}`)
        }
    }
    return (
        <div className='flex  justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md '>
                <div className='text-center '>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>

        </div>
    )
}

export default VerifyAccount
