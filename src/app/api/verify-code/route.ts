import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Reem_Kufi } from "next/font/google";


export async function POST(request: Request){
    await dbConnect()
    try{
        const {username , code} =  await request.json()
        const decodedusername = decodeURIComponent(username)

        const user = await UserModel.findOne({
            username : decodedusername 
        })
        if(!user){
            return Response.json({
                success : false,
                message : " User not found"
            },{status:500})
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
                succes:true,
                message: "Account verified successfully "
            },{status :200})
        }else if(!isCodeValid){
            return Response.json({
                succes : false ,
                message : " Code expired or invalid"
            },{status : 400})
        }else {
            return Response.json({
                success : false,
                message :"Incorrect Code"
            },{status : 400})

        }

    } catch(error){
        console.error("Error in Verifying User",error)
        return Response.json({
            success : false,
            message : " error verifying user"
        },{status :500})
    }


}