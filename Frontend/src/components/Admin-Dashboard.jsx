import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  FileText,
  Pencil,
  X,
  LogOut,
  Trash2,
  Tag,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api";

// ✅ Added "All" and "Rejected"
const statuses = ["All", "Pending", "In Progress", "Resolved", "Rejected"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All"); // ✅ Default = All
  const [editingReport, setEditingReport] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [adminMessageUpdate, setAdminMessageUpdate] = useState("");
  const [modalPhoto, setModalPhoto] = useState(null);

  // 🔥 FETCH FROM SERVER
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No admin token found!");

      const res = await fetch(API_ENDPOINTS.COMPLAINTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setReports(data.complaints || []);
      } else {
        toast.error(data.message || "Failed to fetch complaints");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Server error");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-300";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Rejected":
        return <X className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // ✅ UPDATE STATUS
  const handleUpdate = async (reportId) => {
  if (!statusUpdate) {
    toast.error("Status is required!");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(API_ENDPOINTS.COMPLAINT_BY_ID(reportId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: statusUpdate,
        adminMessage: adminMessageUpdate,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Report updated successfully!");

      // 🔥 Force fresh data from DB
      await fetchComplaints();

      // 🔥 Close edit modal
      setEditingReport(null);
      setStatusUpdate("");
      setAdminMessageUpdate("");

      // 🔥 DO NOT change filter here
      // User can manually click tab
    } else {
      toast.error(data.message || "Update failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Server error");
  }
};


  // ✅ DELETE
  const handleDelete = async (reportId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(API_ENDPOINTS.COMPLAINT_BY_ID(reportId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Report deleted");
        await fetchComplaints();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ✅ FIXED FILTER LOGIC
  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((r) => (r.status || "Pending") === filter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-14 font-sans relative"
    >
      <Toaster />

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="fixed top-6 right-6 px-5 py-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 text-white font-semibold rounded-full flex items-center gap-2 shadow-lg hover:opacity-90 transition-all"
      >
        <LogOut size={18} /> Logout
      </button>

      {/* Header */}
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Manage and update user-reported issues efficiently.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-12 gap-4 flex-wrap">
        {statuses.map((s) => (
          <motion.button
            key={s}
            onClick={() => setFilter(s)}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-full font-semibold shadow-md transition-all ${
              filter === s
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-white/70 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {s}
          </motion.button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 xl:grid-cols-3 place-items-center">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <motion.div
              key={report._id}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="relative bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl p-6 w-full transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 opacity-0 group-hover:opacity-40 blur-2xl transition-all"></div>

              <div className="relative z-10">
                {/* Status */}
                <div
                  className={`flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusStyle(
                    report.status
                  )}`}
                >
                  {getStatusIcon(report.status)} {report.status}
                </div>

                {/* Description */}
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-3 leading-snug line-clamp-2">
                  {report.description}
                </h3>

                {/* Details */}
                <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-3 mb-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-500" />
                      <div>
                        <p className="font-semibold text-gray-700">Category</p>
                        <p className="text-gray-600 capitalize">
                          {report.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-500" />
                      <div>
                        <p className="font-semibold text-gray-700">Area</p>
                        <p className="text-gray-600">{report.area}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo */}
                {report.photoUrl && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setModalPhoto(report.photoUrl)}
                    className="w-full py-2 mb-4 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 shadow-md transition"
                  >
                    View Attached Photo
                  </motion.button>
                )}

                {/* Admin Message */}
                <div className="bg-white/60 border border-gray-200 rounded-xl p-4 shadow-inner mb-4">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Admin Message
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {report.adminMessage || "No message yet"}
                  </p>
                </div>

                {/* Edit / Delete */}
                {editingReport === report._id ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
                      value={adminMessageUpdate}
                      onChange={(e) =>
                        setAdminMessageUpdate(e.target.value)
                      }
                      placeholder="Admin message..."
                    />
                    <select
                      className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                    >
                      <option value="">Select status</option>
                      {statuses
                        .filter((s) => s !== "All")
                        .map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingReport(null)}
                        className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(report._id)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg text-sm font-medium shadow-md hover:opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between mt-4 gap-2">
                    <button
                      onClick={() => {
                        setEditingReport(report._id);
                        setAdminMessageUpdate(report.adminMessage || "");
                        setStatusUpdate(report.status);
                      }}
                      className="px-3 py-1.5 bg-indigo-100 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-indigo-200 transition"
                    >
                      <Pencil size={16} /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="px-3 py-1.5 bg-red-100 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <FileText className="w-14 h-14 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">
              No Reports Found
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              No complaints in this category.
            </p>
          </div>
        )}
      </div>

      {/* Modal Photo */}
      {modalPhoto && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-3xl w-full"
          >
            <button
              onClick={() => setModalPhoto(null)}
              className="absolute top-3 right-3 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition"
            >
              <X size={20} />
            </button>
            <img
              src={modalPhoto}
              alt="Report Attachment"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
