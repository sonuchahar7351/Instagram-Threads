import mongoose from "mongoose";

const messageShema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    seen: {
        type: Boolean,
        default: false,
    },
    img: {
        type: String,
        defaul: "",
    }

}, { timestamps: true })

const Message = mongoose.model("Message", messageShema);
export default Message;