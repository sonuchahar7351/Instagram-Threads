import mongoose from "mongoose";

const ConversationShema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessage: {
    text: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    seen: {
      type: Boolean,
      default: false,
    }
  },
}, { timestamps: true })

const Conversation = mongoose.model('Conversation', ConversationShema);
export default Conversation