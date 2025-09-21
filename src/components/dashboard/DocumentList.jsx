import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { DOCUMENT_CATEGORIES, DOCUMENT_TYPES } from "../utils/constants";
import { formatFileSize, formatDate, getFileIcon } from "../utils/helpers";
import {
  FileText,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Share2,
  Plus,
  Eye,
  X,
} from "lucide-react";

const DebugInfo = ({
  documents,
  loading,
  searchTerm,
  selectedCategory,
  selectedType,
}) => {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
      <h4 className="font-bold text-yellow-800">Debug Info:</h4>
      <p>Loading: {loading.toString()}</p>
      <p>Documents count: {documents.length}</p>
      <p>Search term: "{searchTerm}"</p>
      <p>Category: "{selectedCategory}"</p>
      <p>Type: "{selectedType}"</p>
      <p>API call: GET /api/documents?page=1&limit=12</p>
    </div>
  );
};

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, selectedCategory, selectedType, searchTerm]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedType) params.append("type", selectedType);

      console.log("Fetching documents with params:", params.toString()); // Debug log

      const response = await api.get(`/documents?${params}`);
      console.log("Documents response:", response.data); // Debug log

      setDocuments(response.data.documents || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(
        "Fetch documents error:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch documents");
      setDocuments([]); // Set empty array on error
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId, documentTitle) => {
    if (
      !window.confirm(`Are you sure you want to delete "${documentTitle}"?`)
    ) {
      return;
    }

    setDeleteLoading(documentId);
    try {
      await api.delete(`/documents/${documentId}`);
      toast.success("Document deleted successfully");
      setDocuments(documents.filter((doc) => doc._id !== documentId));
    } catch (error) {
      toast.error("Failed to delete document");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDownload = async (documentId, originalName) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download document");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedType("");
    setCurrentPage(1);
  };

  const DocumentCard = ({ document }) => (
    <div className="card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex items-start space-x-3">
            <div className="text-3xl">{getFileIcon(document.mimeType)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {document.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {DOCUMENT_CATEGORIES[document.category]} •{" "}
                {DOCUMENT_TYPES[document.type]}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(document.createdAt)} •{" "}
                {formatFileSize(document.fileSize)}
              </p>
            </div>
          </div>
        </div>

        {document.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {document.description}
          </p>
        )}

        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {document.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{document.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {document.isShared && (
              <div className="flex items-center space-x-1">
                <Share2 className="w-3 h-3" />
                <span>Shared</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                handleDownload(document._id, document.originalName)
              }
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>

            <Link
              to={`/documents/${document._id}/edit`}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>

            <button
              onClick={() => handleDelete(document._id, document.title)}
              disabled={deleteLoading === document._id}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              {deleteLoading === document._id ? (
                <div className="w-4 h-4 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      ) return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DebugInfo
            documents={documents}
            loading={loading}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
              <p className="text-gray-600 mt-2">
                Manage your secure document collection
              </p>
            </div>
            <Link
              to="/upload"
              className="btn-primary inline-flex items-center mt-4 sm:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="form-input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex lg:items-center lg:space-x-4">
                <select
                  className="form-input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {Object.entries(DOCUMENT_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <select
                  className="form-input"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                {(searchTerm || selectedCategory || selectedType) && (
                  <button
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-4">
                <select
                  className="form-input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {Object.entries(DOCUMENT_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <select
                  className="form-input"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                {(searchTerm || selectedCategory || selectedType) && (
                  <button
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Documents Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card p-6 animate-pulse">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : documents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {documents.map((document) => (
                  <DocumentCard key={document._id} document={document} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === currentPage
                              ? "text-blue-600 bg-blue-50 border border-blue-300"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory || selectedType
                  ? "Try adjusting your search or filters"
                  : "Upload your first document to get started"}
              </p>
              <Link
                to="/upload"
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
