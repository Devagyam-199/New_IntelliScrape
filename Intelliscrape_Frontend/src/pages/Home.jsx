import React, { useEffect, useState } from "react";
import ResizableSidebar from "../components/ResizeableSideBar";
import api from "../utils/axiosApiInterceptor.js";

const Home = () => {
  const [history, setHistory] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchUrl, setSearchUrl] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get("/access/history");
        setHistory(response.data.data);
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
    fetchHistory();
  }, []);

  const handleTitleClick = async (searchHistoryId) => {
    try {
      setLoading(true);
      setErrors(null);
      const response = await api.post(
        `/access/history-data/${searchHistoryId}`
      );
      setSelectedData(response.data.data);
    } catch (error) {
      console.error("Error fetching scraped data:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setErrors(
        error.response?.data?.message || "Failed to fetch scraped data"
      );
      setSelectedData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchUrl.trim()) {
      setErrors("Please enter a valid URL");
      return;
    }
    try {
      setLoading(true);
      setErrors(null);
      const response = await api.post("/access/scrape", { requrl: searchUrl });
      setSelectedData(response.data.data);
      const historyResponse = await api.get("/access/history");
      setHistory(historyResponse.data.data);
      setSearchUrl("");
    } catch (error) {
      console.error("Error scraping URL:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setErrors(error.response?.data?.message || "Failed to scrape URL");
      setSelectedData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full pt-20 bg-gradient-to-br from-slate-950 via-cyan-900 to-slate-900 flex">
      {/* Sidebar */}
      <div className="sm:flex text-white hidden">
        <ResizableSidebar className="shadow-r bg-slate-800 w-64 h-full overflow-y-auto">
          {loading && <p className="p-4 text-sm">Loading...</p>}
          {!loading && history.length === 0 && !errors ? (
            <p className="p-4 text-sm">No history available</p>
          ) : (
            <ul className="p-4 ">
              {history.map((item) => (
                <li
                  key={item.searchHistoryId}
                  className="px-4 my-5 text-sm cursor-pointer hover:text-cyan-300 transition-colors"
                  onClick={() => handleTitleClick(item.searchHistoryId)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </ResizableSidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto px-6 py-10 text-white">
        {/* Errors shown here */}
        {errors && (
          <div className="mb-6 p-4 rounded-lg bg-red-600/20 border border-red-500 text-red-400">
            {errors}
          </div>
        )}

        {!selectedData ? (
          <div className="flex items-center justify-center h-full">
            <form
              onSubmit={handleSearch}
              className="max-w-2xl w-full flex flex-col gap-4"
            >
              <input
                type="text"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                className="w-full px-5 py-3 rounded-3xl border outline-none border-slate-500 text-white bg-slate-800 placeholder-slate-400"
                placeholder="Enter the url to be scraped..."
              />
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-600 text-white rounded-3xl hover:bg-cyan-700 transition-colors self-start"
                disabled={loading}
              >
                {loading ? "Scraping..." : "Scrape"}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto my-14 bg-slate-800 p-8 rounded-lg shadow-lg">
            <button
              onClick={() => setSelectedData(null)}
              className="mb-4 px-4 py-2 bg-cyan-600 text-white rounded-3xl hover:bg-cyan-700 transition-colors"
            >
              Back to Search
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedData.title}</h2>

            {selectedData.summary && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Summary</h3>
                <p>{selectedData.summary}</p>
              </div>
            )}

            {selectedData.highlights?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Highlights</h3>
                <ul className="list-disc pl-5">
                  {selectedData.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedData.paragraphs?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Paragraphs</h3>
                {selectedData.paragraphs.map((para, index) => (
                  <p key={index} className="mb-2">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {selectedData.items?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">Items</h3>
                <ul className="list-disc pl-5">
                  {selectedData.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
