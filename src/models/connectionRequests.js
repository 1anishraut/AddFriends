const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User collection
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Creating ( COMBINED/ Compound) index for fast query in DB
connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

// Optional DB level validation

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
         throw new Error("Canneot send request to yourself")
    }
    next()
})


const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest
