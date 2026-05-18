import { useCallback, useEffect, useMemo, useState } from "react";
import { TiRefresh, TiTick, TiWarningOutline } from "react-icons/ti";

const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=20";
const TIMEOUT_MS = 10000;

const CATEGORIES = ["Arcade", "Cyber", "Fantasy", "Strategy", "Ecosystem"];
const STATUSES = ["Active", "In review", "Archived"];

const createToastId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

const getCategory = (userId) => CATEGORIES[(userId - 1) % CATEGORIES.length];
const getStatus = (id) => STATUSES[id % STATUSES.length];

const buildError = (error) => {
  if (!error) {
    return { code: null, message: "Unable to reach the server. Please try again." };
  }

  if (error.name === "AbortError") {
    return {
      code: "timeout",
      message: "Network timeout. The request took too long, so it was canceled.",
    };
  }

  if (typeof error.code === "number") {
    if (error.code === 404) {
      return {
        code: 404,
        message: "404 — The requested resource was not found. Verify the endpoint and try again.",
      };
    }

    if (error.code >= 500) {
      return {
        code: error.code,
        message: "500 — Server error occurred. The service is temporarily unavailable.",
      };
    }

    return {
      code: error.code,
      message: error.message || "Unexpected server response.",
    };
  }

  return {
    code: "network",
    message: error.message || "Something went wrong while fetching data.",
  };
};

const ApiDataPanel = () => {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  const pushToast = useCallback((type, message) => {
    const id = createToastId();
    setToasts((prev) => [{ id, type, message }, ...prev]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4200);
  }, []);

  const fetchData = useCallback(async () => {
    setStatus("loading");
    setError(null);
    setData([]);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(API_URL, { signal: controller.signal });

      if (!response.ok) {
        throw {
          code: response.status,
          message: response.statusText || "Request failed.",
        };
      }

      const json = await response.json();

      if (!Array.isArray(json) || json.length === 0) {
        setStatus("empty");
        pushToast("success", "No content available right now. Empty state shown.");
        return;
      }

      const enriched = json.map((item) => ({
        ...item,
        category: getCategory(item.userId),
        status: getStatus(item.id),
      }));

      setData(enriched);
      setStatus("success");
      pushToast("success", "Data loaded successfully.");
    } catch (fetchError) {
      const normalizedError = buildError(fetchError);
      setError(normalizedError);
      setStatus("error");
      pushToast("error", normalizedError.message);
    } finally {
      window.clearTimeout(timeoutId);
    }
  }, [pushToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const normalizedQuery = useMemo(() => normalizeText(searchQuery), [searchQuery]);

  const filteredData = useMemo(() => {
    if (status !== "success") return [];

    return data
      .filter((item) => {
        const content = normalizeText(`${item.title} ${item.body} ${item.category} ${item.status}`);
        const matchesSearch = normalizedQuery.length === 0 || content.includes(normalizedQuery);
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = normalizeText(a.title);
        const bValue = normalizeText(b.title);
        if (aValue === bValue) return 0;
        return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : aValue > bValue ? -1 : 1;
      });
  }, [data, normalizedQuery, selectedCategory, selectedStatus, sortOrder, status]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSortOrder("asc");
  };

  return (
    <section id="api-status" className="relative mx-auto mb-20 max-w-6xl rounded-[2rem] border border-slate-200/80 bg-slate-50/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-general text-xs uppercase tracking-[0.24em] text-slate-500">
            Live API preview
          </p>
          <h2 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">
            Search, filter and sort dynamic results
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Query the dataset in real-time, filter by category and status, and sort ascending or descending.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="button"
        >
          <TiRefresh className="h-4 w-4" />
          Reload data
        </button>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Search
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search items, categories, or status"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Category
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Status
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-3 text-sm text-slate-700">
            <span>Sort</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSortOrder("asc")}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${sortOrder === "asc" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                A → Z
              </button>
              <button
                type="button"
                onClick={() => setSortOrder("desc")}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${sortOrder === "desc" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Z → A
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Showing</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {filteredData.length} of {data.length} items
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200"
          >
            Clear filters
          </button>
        </div>

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <div className="api-spinner"></div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Loading latest content...</p>
              <p className="mt-2 text-sm text-slate-500">Fetching from the API and keeping the UI responsive.</p>
            </div>
          </div>
        )}

        {status === "error" && error && (
          <div className="api-empty">
            <TiWarningOutline className="h-12 w-12 text-rose-500" />
            <div>
              <p className="text-xl font-semibold text-slate-950">Something went wrong</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{error.message}</p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              type="button"
            >
              <TiRefresh className="h-4 w-4" />
              Retry request
            </button>
          </div>
        )}

        {status === "empty" && (
          <div className="api-empty">
            <TiTick className="h-12 w-12 text-slate-900" />
            <div>
              <p className="text-xl font-semibold text-slate-950">No items found</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                The API returned an empty result set. Try refreshing or check back later when new content is available.
              </p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              type="button"
            >
              <TiRefresh className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        {status === "success" && (
          <>
            {filteredData.length === 0 ? (
              <div className="api-empty">
                <TiWarningOutline className="h-12 w-12 text-slate-900" />
                <div>
                  <p className="text-xl font-semibold text-slate-950">No results found</p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Try adjusting your search terms, filters, or sorting options.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredData.map((item) => (
                  <div key={item.id} className="api-card">
                    <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
                      <span className="rounded-full bg-slate-100 px-3 py-1">{item.category}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">{item.status}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="toast-panel" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item ${toast.type === "success" ? "toast-success" : "toast-error"}`}
          >
            <p className="font-semibold">{toast.type === "success" ? "Success" : "Error"}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{toast.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ApiDataPanel;
