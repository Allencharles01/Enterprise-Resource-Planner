"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FolderOpen,
  FileSpreadsheet,
  ChevronRight,
  Download,
  Trash2,
  Search,
  X,
  ArrowLeft,
  HardDrive,
} from "lucide-react";
import { api } from "@/lib/api";

export default function CsvDocsExplorerModal({ isOpen, onClose }) {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState([]); // Array of folder names
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/contact-lists/explorer");
      setTree(res.data || []);
    } catch (err) {
      console.error("Failed to fetch folder tree:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      fetchTree();
      setCurrentPath([]);
      setSearchQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Resolve current active folder
  const getFolderByPath = (rootTree, pathParts) => {
    let currentChildren = rootTree;
    let activeFolder = { name: "Root", children: rootTree };

    for (const part of pathParts) {
      const found = currentChildren?.find(
        (c) => c.name === part && c.type === "directory"
      );
      if (!found) return null;
      activeFolder = found;
      currentChildren = found.children || [];
    }
    return activeFolder;
  };

  const activeFolder = getFolderByPath(tree, currentPath);
  const items = activeFolder ? activeFolder.children || [] : [];

  // Filter items (folders and files) by search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFolderClick = (folderName) => {
    setCurrentPath([...currentPath, folderName]);
    setSearchQuery("");
  };

  const handleBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
      setSearchQuery("");
    }
  };

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
    setSearchQuery("");
  };

  const handleDownload = async (file) => {
    try {
      const res = await api.get(
        `/api/contact-lists/explorer/download?filePath=${encodeURIComponent(
          file.path
        )}`,
        { responseType: "blob" }
      );
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file.");
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Are you sure you want to delete "${file.name}"? This action will remove it permanently from MongoDB Atlas.`)) {
      return;
    }
    try {
      await api.delete(
        `/api/contact-lists/explorer/file?filePath=${encodeURIComponent(file.path)}`
      );
      fetchTree();
    } catch (err) {
      console.error("Delete file failed:", err);
      alert(err.response?.data?.error || "Failed to delete file.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl h-[85vh] flex flex-col bg-background border border-indigo-500/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <HardDrive size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  CSV Docs Explorer
                </h3>
                <p className="text-xs text-muted-foreground">
                  Browse, download, and delete archived and assigned CSV documents
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-6 py-4 bg-muted/20 border-b border-border/40">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <button
                onClick={() => setCurrentPath([])}
                className="hover:text-primary transition-all font-semibold"
              >
                CSV Docs
              </button>
              {currentPath.map((folder, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <ChevronRight size={14} className="text-muted-foreground/50" />
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className={`hover:text-primary transition-all font-semibold ${index === currentPath.length - 1
                        ? "text-foreground"
                        : ""
                      }`}
                  >
                    {folder}
                  </button>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {currentPath.length > 0 && (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              <div className="relative flex-1 md:w-64">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search in this folder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-background border border-border rounded-xl outline-none focus:border-indigo-500 transition-all text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Explorer Main View */}
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <span className="text-xs text-muted-foreground">Loading directory tree...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl text-muted-foreground mb-4">
                  <FolderOpen size={48} className="opacity-50" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">
                  Folder is Empty
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm">
                  {searchQuery
                    ? "No files or folders matched your query."
                    : "This subdirectory currently contains no files or archives."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map((item, idx) => {
                  const isFolder = item.type === "directory";

                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group flex flex-col bg-muted/10 border border-border/50 rounded-2xl p-4 cursor-pointer hover:bg-muted/20 hover:border-indigo-500/30 transition-all relative overflow-hidden"
                      onClick={() =>
                        isFolder
                          ? handleFolderClick(item.name)
                          : handleDownload(item)
                      }
                    >
                      {/* Icon & Details */}
                      <div className="flex items-start justify-between mb-4">
                        {isFolder ? (
                          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                            <Folder size={24} className="fill-amber-500/10" />
                          </div>
                        ) : (
                          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                            <FileSpreadsheet size={24} />
                          </div>
                        )}

                        {!isFolder && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(item);
                              }}
                              className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-lg border border-indigo-500/20 hover:border-indigo-500 transition-all"
                              title="Download CSV"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item);
                              }}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg border border-rose-500/20 hover:border-rose-500 transition-all"
                              title="Delete from Database"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <span className="text-xs font-bold text-foreground truncate w-full mb-1 group-hover:text-primary transition-all">
                        {item.name}
                      </span>

                      {/* Sub-label */}
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        {isFolder
                          ? `${item.children?.length || 0} items`
                          : "CSV Spreadsheet"}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
