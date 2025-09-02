import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosApiInterceptor.js";

const ScrapedHistory = () => {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      setErrors(null);
      const response = await api.get(
        `/access/history?page=${page}&limit=${pagination.limit}`
      );
      setHistory(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching history:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setErrors(error.response?.data?.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCardClick = async (searchHistoryId) => {
    try {
      setLoading(true);
      setErrors(null);
      const response = await api.get(`/access/history-data/${searchHistoryId}`);
      navigate("/home", { state: { selectedData: response.data.data } });
    } catch (error) {
      console.error("Error fetching scraped data:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setErrors(
        error.response?.data?.message || "Failed to fetch scraped data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchHistory(newPage);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-cyan-900 to-slate-900 flex flex-col">
      <div className="px-3  sm:px-6 py-25 text-white w-full md:w-5/6 lg:w-4/6 mx-auto flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center sm:text-left">
            Scrape History
          </h1>
          <button
            onClick={() => navigate("/home")}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-cyan-600 text-white text-xs sm:text-sm md:text-base rounded-full hover:bg-cyan-700 transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Error Alert */}
        {errors && (
          <div className="mb-6 p-3 sm:p-4 rounded-lg bg-red-600/20 border border-red-500 text-xs sm:text-sm md:text-base text-red-400">
            {errors}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-h-[400px] flex flex-col justify-center">
          {loading && (
            <p className="text-center text-sm sm:text-base">Loading...</p>
          )}
          {!loading && history.length === 0 && !errors ? (
            <p className="text-center text-sm sm:text-base">
              No history available
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {history.map((item) => (
                <div
                  key={item.searchHistoryId}
                  onClick={() => handleCardClick(item.searchHistoryId)}
                  className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 truncate">
                    {item.url}
                  </p>
                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-300">
                    <span>
                      {new Date(item.scrapedAt).toLocaleDateString("en-US", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </span>
                    <span
                      className={`${
                        item.status === "success"
                          ? "text-green-400"
                          : item.status === "failed"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-3 flex-wrap">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 sm:px-4 bg-cyan-600 text-white text-xs sm:text-sm md:text-base rounded-lg disabled:bg-slate-600 hover:bg-cyan-700 transition"
            >
              Previous
            </button>
            <span className="text-xs sm:text-sm md:text-base">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 sm:px-4 bg-cyan-600 text-white text-xs sm:text-sm md:text-base rounded-lg disabled:bg-slate-600 hover:bg-cyan-700 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapedHistory;
