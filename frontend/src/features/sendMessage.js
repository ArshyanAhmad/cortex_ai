
import api from '../../utils/axios'

async function sendMessage(payload) {
 try {
    const {data}=await api.post("/api/agent/chat",payload)
    return { success: true, ...data }
 } catch (error) {
    console.error("sendMessage error:", error)
    const message =
       error?.response?.data?.message ||
       (typeof error?.response?.data === "string" ? error.response.data : null) ||
       error?.message ||
       "Something went wrong. Please try again."
    return { success: false, answer: message, images: [], artifacts: [] }
 }
}

export default sendMessage
