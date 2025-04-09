import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: " You are not auhtenticated"
        }, { status: 401 })
    }

    const  userId =user._id 
    const {acceptmessages} = await request.json()

    try{
       const updatedUser= await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptmessages},
            {new: true}
        )

        if(!updatedUser){
            return Response.json({
                succes: false,
                message : " failed to update user "
            },{status : 401})
        }

            return Response.json({
                success: true,
                message : " User updated successfully",
                updatedUser
            },{status: 200})

    } catch (error) {
        return Response.json({
            success : false,
            message : " Error in accepting messages"

        },{status: 500})
    }
}

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: " You are not auhtenticated"
        }, { status: 401 })
    }

    const  userId =user._id ;
    
     try{
        const foundUser  =await UserModel.findById(userId)

    if(!foundUser){
        return Response.json({
            success: false,
            message: " User not found"
        },{status: 404})
    }

    return Response.json({
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
        message: " User found",
        user: foundUser
    },{status: 200})
     } catch (error) {
        console.log("failed to get user")
        return Response.json({
            success : false,
            message : " Error in accepting messages"

        },{status: 500})
    }
}
