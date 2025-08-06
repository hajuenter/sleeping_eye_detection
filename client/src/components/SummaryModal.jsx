import React, { useEffect, useState } from "react";
import { X, BarChart3, PieChart, Download } from "lucide-react";
import axios from "axios";
import { getSessionId } from "../utils/session";
import { buildApiUrl, API_ENDPOINTS } from "../config/api";

const SummaryModal = ({ isOpen, onClose, summary }) => {
  const [lineChartUrl, setLineChartUrl] = useState(null);
  const [pieChartUrl, setPieChartUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && summary) {
      fetchCharts();
    }
  }, [isOpen, summary]);

  const fetchCharts = async () => {
    setLoading(true);
    try {
      const sessionId = getSessionId();

      // Fetch line chart
      const lineUrl = buildApiUrl(API_ENDPOINTS.ANALYSIS_LINE, {
        session_id: sessionId,
      });
      const lineResponse = await axios.get(lineUrl, {
        responseType: "blob",
        timeout: 15000,
      });
      const lineObjectUrl = URL.createObjectURL(lineResponse.data);
      setLineChartUrl(lineObjectUrl);

      // Fetch pie chart
      const pieUrl = buildApiUrl(API_ENDPOINTS.ANALYSIS_PIE, {
        session_id: sessionId,
      });
      const pieResponse = await axios.get(pieUrl, {
        responseType: "blob",
        timeout: 15000,
      });
      const pieObjectUrl = URL.createObjectURL(pieResponse.data);
      setPieChartUrl(pieObjectUrl);
    } catch (error) {
      console.error("Error fetching charts:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadChart = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    // Clean up URLs
    if (lineChartUrl) URL.revokeObjectURL(lineChartUrl);
    if (pieChartUrl) URL.revokeObjectURL(pieChartUrl);
    setLineChartUrl(null);
    setPieChartUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Detection Analysis Report
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating analysis charts...</p>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              {summary && (
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {summary.total_frames}
                    </div>
                    <div className="text-sm text-gray-600">Total Frames</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {summary.percentage_opened}%
                    </div>
                    <div className="text-sm text-gray-600">Alert Time</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {summary.percentage_closed}%
                    </div>
                    <div className="text-sm text-gray-600">Drowsy Time</div>
                  </div>
                </div>
              )}

              {/* Status Alert */}
              {summary && (
                <div
                  className={`p-4 rounded-xl mb-6 text-center ${
                    summary.percentage_closed > 60
                      ? "bg-red-100 border border-red-200"
                      : "bg-green-100 border border-green-200"
                  }`}
                >
                  <div
                    className={`text-lg font-bold ${
                      summary.percentage_closed > 60
                        ? "text-red-700"
                        : "text-green-700"
                    }`}
                  >
                    {summary.status}
                  </div>
                </div>
              )}

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={20} className="text-cyan-500" />
                      <h3 className="font-semibold">Detection Timeline</h3>
                    </div>
                    {lineChartUrl && (
                      <button
                        onClick={() =>
                          downloadChart(lineChartUrl, "detection-timeline.png")
                        }
                        className="flex items-center gap-1 px-3 py-1 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-600 transition-colors"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    )}
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    {lineChartUrl ? (
                      <img
                        src={lineChartUrl}
                        alt="Detection Timeline"
                        className="w-full h-auto rounded-lg"
                      />
                    ) : (
                      <div className="h-48 flex items-center justify-center text-gray-500">
                        <BarChart3 size={48} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <PieChart size={20} className="text-teal-500" />
                      <h3 className="font-semibold">Status Distribution</h3>
                    </div>
                    {pieChartUrl && (
                      <button
                        onClick={() =>
                          downloadChart(pieChartUrl, "status-distribution.png")
                        }
                        className="flex items-center gap-1 px-3 py-1 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition-colors"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    )}
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    {pieChartUrl ? (
                      <img
                        src={pieChartUrl}
                        alt="Status Distribution"
                        className="w-full h-auto rounded-lg"
                      />
                    ) : (
                      <div className="h-48 flex items-center justify-center text-gray-500">
                        <PieChart size={48} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {summary && (
                <div className="mt-8 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Recommendations
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    {summary.percentage_closed > 60 ? (
                      <>
                        <p>• Consider taking a break or getting some rest</p>
                        <p>
                          • Ensure you're getting adequate sleep (7-9 hours per
                          night)
                        </p>
                        <p>• Stay hydrated and maintain good posture</p>
                        <p>
                          • If drowsiness persists, consult a healthcare
                          professional
                        </p>
                      </>
                    ) : summary.percentage_closed > 30 ? (
                      <>
                        <p>
                          • Good alertness level, but monitor fatigue levels
                        </p>
                        <p>• Take regular breaks during long activities</p>
                        <p>• Maintain a consistent sleep schedule</p>
                      </>
                    ) : (
                      <>
                        <p>• Excellent alertness level maintained!</p>
                        <p>• Keep up the good sleep hygiene</p>
                        <p>
                          • Continue monitoring your alertness during critical
                          activities
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
