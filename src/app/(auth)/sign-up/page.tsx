"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { Toaster } from "@/components/ui/sonner";
import router, { useRouter } from "next/router"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"; // Ensure this is the correct library or path
// import { useToast } from "@/hooks/use-toast"

const page = () => {
  
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  
  const debounced = useDebounceCallback((value: string) => setUsername(value), 500)
  
  //   const router = useRouter()
  
  
  // zod implementation 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''

    }
  })
  useEffect(() => {
    const checkusernameunique = async () => {
      if (username) {
        setIsChecking(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        }
        finally {
          setIsChecking(false)
        }
      }
    }
    checkusernameunique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast(
        <div>
          <strong>Success</strong>
          <p>{response.data.message}</p>
        </div>
      )
      router.replace(`/verify/${username}`)


    } catch (error) {
      console.error("Error in signup of User", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.messages
      toast(
        <div>
          <strong>SignUp Failed</strong>
          <p>{Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage}</p>
        </div>
      )
    }
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

         <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} onChange={(e) =>{
                  field.onChange(e)
                  debounced(e.target.value)
                }} />
                
              </FormControl>
              { isChecking && <Loader2 className="animate-spin" /> }

              <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' :'text-red-500'}`}>
                 {usernameMessage}
                
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
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
      <Button type ="submit" disabled = {isSubmitting}>
        {
          isSubmitting? (
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
            </>
          ) :('Signup')
        }
      </Button>
        </form>
         </Form>
         <div className="text-center mt-4 ">
          <p>
            Already a member ?{''} 
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign In</Link>
          </p>
         </div>
      </div>

    </div>
  )
}

export default page
