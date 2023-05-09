const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    conversationId: String,
    sender: String,
    receiver: String,
    message: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", MessageSchema);
