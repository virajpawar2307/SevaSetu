import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // links complaint to user
    },
    category: { type: String, required: true },
    area: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String }, // store uploaded file path or URL
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"], // added Rejected
      default: "Pending",
    },
    adminMessage: { type: String, default: "" }, // optional admin message
  },
  { timestamps: true } // createdAt & updatedAt
);

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
