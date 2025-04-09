"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import {  useState } from "react"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"



const page = () => {
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
    const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''

    }
  })
  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
   const result =  await signIn('credentials', {
      redirect : false , 
      identifier  : data.identifier ,
      password : data.password 
    })
    if(result?.error){
      toast.error("Login Failed: Incorrect username or password")
    }

    if(result?.url){
    router?.replace('/dashboard')}
  }


  return (
    <div className="flex  justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md  p-8 space-y-8 bg-white rounded-lg shadow-md ">
         <div className="text-center">
           <h1 className="text-4xl font-extrabold tracking-tight ">
            Join True Feedback
           </h1>
           <p className="mb-4"> Sign Up to Start Your Anonymous Adventure </p>
         </div>

         <Form {...form} >
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username </FormLabel>
              <FormControl>
                <Input placeholder="email or username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Signing in...' : 'Sign In'}
</Button>
        </Form>
         <div className="text-center mt-4 ">
          <p>
            Not Registered ?{''} 
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
            Sign up</Link>
          </p>
         </div>
      </div>

    </div>
  )
}

export default page
