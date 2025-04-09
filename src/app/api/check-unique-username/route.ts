import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username : usernameValidation 
})

export async function GET(request : Request){
    
    await dbConnect()
    
    try{
        const {searchParams}=new URL(request.url)
        const queryparams = {
            username : searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryparams)
        console.log(result)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                succes : false,
                message : usernameErrors?.length > 0 ? usernameErrors.join(', ')
                : "Invalid query parameters",
            },{status : 400 } 
        )}

        const {username} =result.data

        const  existingVerifiedUser = await UserModel.findOne({
            username, isVerified : true 
        })
        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : " Username is Already taken."

            },{status : 400})
        }else{
            return Response.json({
                success : true,
                message : "Username is unique"

            },{status : 200})
        }


    } catch(error){
        console.error("Error in GET /api/check-unique-username", error)
        return Response.json({
            success : false,
        message : "error checking username"   
         },{status : 500}
        )
    }
}