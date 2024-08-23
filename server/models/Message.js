const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "chatroom is required"],
      ref: "User",
      lowercase: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "senderId is required"],
      ref: "User",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

// messageSchema.statics.CheckChatRoom = async function (name) {
//   const chatroom = await this.findOne({ name });
//   if (!chatroom) {
//     const chatroom = await this.create({ name });
//     return chatroom;
//   }
//   return chatroom;
// };

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
