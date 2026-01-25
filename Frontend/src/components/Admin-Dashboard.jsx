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

const statuses = ["Pending", "In Progress", "Resolved"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [editingReport, setEditingReport] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [adminMessageUpdate, setAdminMessageUpdate] = useState("");
  const [modalPhoto, setModalPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch complaints from server
  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No admin token found!");

      const res = await fetch(API_ENDPOINTS.COMPLAINTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setReports(data.complaints);
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
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // 🔥 UPDATE STATUS
  const handleUpdate = async (reportId) => {
    if (!statusUpdate) {
      toast.error("Status is required!");
      return;
    }

    try {
      setLoading(true);
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

        // 🔥 THIS IS THE FIX: REFRESH FROM SERVER
        await fetchComplaints();

        setEditingReport(null);
        setStatusUpdate("");
        setAdminMessageUpdate("");

        // Optional: auto switch tab
        setFilter(statusUpdate);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE
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

        // Refresh list
        await fetchComplaints();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const filteredReports = reports.filter(
    (r) => (r.status || "Pending") === filter
  );

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
              {/* ... YOUR UI REMAINS SAME ... */}
              <div className="relative z-10">
                {/* Keep your existing JSX exactly as it is */}
                {/* Only logic functions were changed */}
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
              All reports have been resolved or none exist yet.
            </p>
          </div>
        )}
      </div>

      {/* Modal remains same */}
    </motion.div>
  );
};

export default AdminDashboard;
