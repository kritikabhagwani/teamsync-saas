const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    accepted: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
  type: Date,
  required: true,
  index: { expires: 0 },
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invite", inviteSchema);