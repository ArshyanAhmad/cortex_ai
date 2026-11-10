import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"
import redis from "../../../shared/redis/redis.js"


export const agent=async (req,res,next) => {
    try {
        const {prompt,conversationId,agent}=req.body
        const file=req.file
        console.log("Uploaded file received:", file ? { originalname: file.originalname, mimetype: file.mimetype, size: file.size } : "none")
        const userId=req.headers["x-user-id"]

        try {
            await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
                conversationId,
                role:"user",
                content:prompt || (file ? `Attached ${file.originalname}` : ""),
                file: file ? {
                    name: file.originalname,
                    size: file.size,
                    type: file.mimetype
                } : undefined
            })
        } catch (chatErr) {
            console.error("Failed to save user message to chat service:", chatErr?.message || chatErr)
        }

        const result=await graph.invoke({
            prompt,conversationId,agent,userId,file
        })
        console.log("Graph invoke complete. aiResponse length:", result?.aiResponse?.length)

        try {
            await addMessage(conversationId,"user",prompt || (file ? `Attached ${file.originalname}` : ""))
            if (result?.aiResponse) {
                await addMessage(conversationId,"assistant",result.aiResponse)
            }
        } catch (memErr) {
            console.error("Failed to update conversation memory in redis:", memErr?.message || memErr)
        }

        try {
            await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
                conversationId,role:"assistant",content:result?.aiResponse,images:result?.images,artifacts:result?.artifacts
            })
        } catch (saveErr) {
            console.error("Failed to save assistant message to chat service:", saveErr?.message || saveErr)
        }

        return res.status(200).json({
            answer:result?.aiResponse,
            images:result?.images,
            artifacts:result?.artifacts
        })
       
    } catch (error) {
       console.error("Agent controller error:", error?.message || error)
       next(error)
    }
}