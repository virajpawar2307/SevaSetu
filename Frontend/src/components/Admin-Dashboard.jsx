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

const statuses = ["All", "Pending", "In Progress", "Resolved", "Rejected"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editingReport, setEditingReport] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [adminMessageUpdate, setAdminMessageUpdate] = useState("");
  const [modalPhoto, setModalPhoto] = useState(null);

  // ================= FETCH =================
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

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
      console.error("Fetch error:", err);
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ================= UI HELPERS =================
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

  // ================= UPDATE =================
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
        toast.success("Report updated!");

        // 🔥 INSTANT UI UPDATE (NO REFETCH)
        setReports((prev) =>
          prev.map((r) =>
            r._id === reportId
              ? {
                  ...r,
                  status: statusUpdate,
                  adminMessage: adminMessageUpdate,
                }
              : r
          )
        );

        setEditingReport(null);
        setStatusUpdate("");
        setAdminMessageUpdate("");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (reportId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(API_ENDPOINTS.COMPLAINT_BY_ID(reportId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Deleted");

        // 🔥 INSTANT UI REMOVE
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ================= FILTER =================
  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((r) => (r.status || "Pending") === filter);

  // ================= UI =================
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
        className="fixed top-6 right-6 px-5 py-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 text-white font-semibold rounded-full flex items-center gap-2 shadow-lg hover:opacity-90"
      >
        <LogOut size={18} /> Logout
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>
        <p className="text-gray-500">Manage complaints</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full font-semibold ${
              filter === s
                ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
                : "bg-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report._id} className="bg-white p-6 rounded-xl shadow">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusStyle(
                  report.status
                )}`}
              >
                {getStatusIcon(report.status)} {report.status}
              </div>

              <h3 className="font-bold text-lg mt-3">
                {report.description}
              </h3>

              <p className="text-sm mt-2">Category: {report.category}</p>
              <p className="text-sm">Area: {report.area}</p>

              <p className="mt-3 text-sm">
                Admin: {report.adminMessage || "No message"}
              </p>

              {editingReport === report._id ? (
                <>
                  <textarea
                    className="w-full border mt-3 p-2"
                    value={adminMessageUpdate}
                    onChange={(e) =>
                      setAdminMessageUpdate(e.target.value)
                    }
                  />
                  <select
                    className="w-full border mt-2 p-2"
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
                  <button
                    onClick={() => handleUpdate(report._id)}
                    className="mt-2 w-full bg-green-500 text-white p-2 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingReport(report._id);
                      setStatusUpdate(report.status);
                      setAdminMessageUpdate(report.adminMessage || "");
                    }}
                    className="flex-1 bg-blue-500 text-white p-2 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="flex-1 bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No complaints
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
