import Complaint from "../model/complaint.model.js";
import User from "../model/user.model.js";
import { sendEmail } from "../utils/sendmails.js"; 

// ===================== CREATE COMPLAINT (USER) =====================
export const createComplaint = async (req, res) => {
  try {
    const { category, area, description } = req.body;
    if (!category || !area || !description || !req.file?.path)
      return res.status(400).json({ message: "All fields are required" });

    const complaint = new Complaint({
      user: req.user._id,
      category,
      area,
      description,
      photoUrl: req.file.path,
      status: "Pending",
      adminMessage: "",
    });

    await complaint.save();
    console.log("✅ Complaint created by:", req.user.email);

    // ✅ Send email to user
    await sendEmail(
      req.user.email,
      "Complaint Submitted Successfully 📝",
      `<h3>Hi ${req.user.fullName || "User"},</h3>
       <p>Your complaint has been submitted successfully.</p>
       <p><b>Category:</b> ${complaint.category}<br>
       <b>Area:</b> ${complaint.area}</p>
       <p>We’ll notify you when there’s an update.</p>
       <br><p>– SevaSetu Support</p>`
    );

    return res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (err) {
    console.error("🔥 Complaint creation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== GET COMPLAINTS =====================
export const getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.isAdmin) {
      complaints = await Complaint.find()
        .populate("user", "fullName email username")
        .sort({ createdAt: -1 });
      console.log(`📬 Admin fetched all complaints (${complaints.length})`);
    } else {
      complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
      console.log(`📬 User fetched own complaints: ${req.user.email} (${complaints.length})`);
    }

    return res.json({ complaints });
  } catch (err) {
    console.error("🔥 Error fetching complaints:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== UPDATE COMPLAINT (ADMIN) =====================
export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminMessage } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (status) complaint.status = status;
    if (adminMessage !== undefined) complaint.adminMessage = adminMessage;

    await complaint.save();
    console.log(`✅ Complaint ${id} updated by admin`);

    // ✅ Send update email to user
    const user = await User.findById(complaint.user);
    let subject = "Complaint Update 🔔";
    let html = `<h3>Hi ${user.fullName},</h3>
                <p>Your complaint has been updated by the admin.</p>`;

    if (adminMessage) {
      html += `<p><b>Admin Message:</b> ${adminMessage}</p>`;
    }

    if (status === "Resolved") {
      subject = "Complaint Resolved ✅";
      html += `<p>We're glad to inform you that your complaint has been marked as resolved.</p>`;
    }

    html += `<br><p>– SevaSetu Support</p>`;

    await sendEmail(user.email, subject, html);

    return res.json({ message: "Complaint updated successfully", complaint });
  } catch (err) {
    console.error("🔥 Error updating complaint:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== REJECT COMPLAINT (ADMIN) =====================
export const rejectComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = "Rejected";
    await complaint.save();
    console.log(`❌ Complaint ${id} rejected by admin`);

    // ✅ Email user about rejection
    const user = await User.findById(complaint.user);
    await sendEmail(
      user.email,
      "Complaint Rejected ❌",
      `<h3>Hi ${user.fullName},</h3>
       <p>We regret to inform you that your complaint has been rejected by the admin.</p>
       <p>If you believe this is a mistake, please resubmit your complaint.</p>
       <br><p>– SevaSetu Support</p>`
    );

    return res.json({ message: "Complaint rejected successfully", complaint });
  } catch (err) {
    console.error("🔥 Error rejecting complaint:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== DELETE COMPLAINT (ADMIN) =====================
export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    await complaint.deleteOne();
    console.log(`🗑️ Complaint ${id} deleted by admin`);

    return res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error("🔥 Error deleting complaint:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
