import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CornerUpLeft, CheckCircle, Clock, FileText, MapPin, Tag, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [modalPhoto, setModalPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Login required");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(API_ENDPOINTS.COMPLAINTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setReports(data.complaints || []);
        else toast.error(data.message || "Failed to fetch reports");
      } catch (err) {
        console.error(err);
        toast.error("Server error");
      }
    };
    fetchReports();
  }, [navigate]);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 flex flex-col items-center px-6 py-14"
    >
      <Toaster />

      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col items-center mb-12 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-5 py-2 mb-6 bg-white/80 border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all"
        >
          <CornerUpLeft size={18} className="text-gray-600" />
          <span className="text-gray-700 font-medium">Back to Dashboard</span>
        </motion.button>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
          My Reports
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Track your submitted issues, review admin updates, and view attached photos.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="w-full max-w-7xl">
        {reports.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3 place-items-center">
            {reports.map((report) => (
              <motion.div
                key={report._id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="w-full bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all group"
              >
                {/* Decorative Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 opacity-0 group-hover:opacity-50 blur-2xl transition-all"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Status Badge */}
                  <div
                    className={`flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusStyle(
                      report.status
                    )}`}
                  >
                    {getStatusIcon(report.status)} {report.status}
                  </div>

                  {/* Description */}
                  <h3 className="text-xl font-bold text-gray-900 leading-snug mt-4 mb-3 line-clamp-2">
                    {report.description}
                  </h3>

                  {/* Details Section */}
                  <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-3 mb-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-500" />
                        <div>
                          <p className="font-semibold text-gray-700">Category</p>
                          <p className="text-gray-600 capitalize">{report.category}</p>
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

                  {/* Photo Button */}
                  {report.photoUrl && (
                    <button
                      onClick={() => setModalPhoto(report.photoUrl)}
                      className="w-full py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 shadow-md transition"
                    >
                      View Attached Photo
                    </button>
                  )}

                  {/* Admin Message */}
                  <div className="mt-5 bg-white/70 border border-gray-200 rounded-xl p-4 shadow-inner">
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">
                      Admin Message
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {report.adminMessage || "Pending review"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <FileText className="w-14 h-14 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">
              No Reports Found
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              You haven’t submitted any issues yet.
            </p>
          </div>
        )}
      </div>

      {/* Modal for Photo */}
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

export default MyReports;
