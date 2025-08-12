const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequests");


const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //Handel Events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);                                  // [userId, targetUserId].sort().join("_")
      // console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          // console.log(lastName + " " + text);

          // TODO: Check if userId & targetUserId are friends
          const isFriend = await ConnectionRequest.findOne({
            $or: [
              { fromUserId: userId, toUserId: targetUserId },
              { fromUserId: targetUserId, toUserId: userId },
            ],
            status: "accepted", 
          });

          if (!isFriend) {
            console.log(
              `Message blocked: ${userId} and ${targetUserId} are not friends`
            );
            return; 
          }




          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          // ✅ NEW: Add timestamp when message is created
          const sendTime = new Date(); // CHANGE

          chat.messages.push({
            senderId: userId,
            text,
            createdAt: sendTime, // CHANGE
          });

          await chat.save();

          // ✅ NEW: Send sendTime to frontend
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            sendTime, // CHANGE
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
