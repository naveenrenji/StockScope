const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    user1: String,
    user2: String
  }
);

module.exports = mongoose.model("conversations", ConversationSchema);
