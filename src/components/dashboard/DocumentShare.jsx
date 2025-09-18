import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES,
  PERMISSIONS,
  RELATIONSHIP_TYPES,
} from "../utils/constants";
import { formatDate, getFileIcon } from "../utils/helpers";
import {
  Share2,
  Users,
  Send,
  Eye,
  Download,
  X,
  Plus,
  UserPlus,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const DocumentShare = () => {
  const [activeTab, setActiveTab] = useState("share"); // 'share', 'received', 'sent'
  const [documents, setDocuments] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [mySharedDocs, setMySharedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);

  // Share form state
  const [shareForm, setShareForm] = useState({
    shareWithEmail: "",
    permissions: "view",
    relationshipType: "other",
    shareMessage: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsRes, receivedRes, sentRes] = await Promise.all([
        api.get("/documents"),
        api.get("/share/received"),
        api.get("/share/sent"),
      ]);

      setDocuments(docsRes.data.documents || []);
      setSharedWithMe(receivedRes.data.sharedDocuments || []);
      setMySharedDocs(sentRes.data.sharedDocuments || []);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleShareDocument = (document) => {
    setSelectedDocument(document);
    setShowShareModal(true);
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDocument || !shareForm.shareWithEmail.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setShareLoading(true);
    try {
      await api.post("/share/document", {
        documentId: selectedDocument._id,
        ...shareForm,
      });

      toast.success("Document shared successfully!");
      setShowShareModal(false);
      setShareForm({
        shareWithEmail: "",
        permissions: "view",
        relationshipType: "other",
        shareMessage: "",
      });
      fetchData(); // Refresh data
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to share document";
      toast.error(message);
    } finally {
      setShareLoading(false);
    }
  };

  const handleRevokeShare = async (shareId) => {
    if (!window.confirm("Are you sure you want to revoke this share?")) {
      return;
    }

    try {
      await api.delete(`/share/${shareId}`);
      toast.success("Share revoked successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to revoke share");
    }
  };

  const ShareModal = () => {
    if (!showShareModal || !selectedDocument) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Share Document
              </h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Document Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getFileIcon(selectedDocument.mimeType)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedDocument.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {DOCUMENT_CATEGORIES[selectedDocument.category]} •{" "}
                    {DOCUMENT_TYPES[selectedDocument.type]}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleShareSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="Enter family member's email"
                  value={shareForm.shareWithEmail}
                  onChange={(e) =>
                    setShareForm({
                      ...shareForm,
                      shareWithEmail: e.target.value,
                    })
                  }
                />
              </div>

              {/* Permissions */}
              <div>
                <label className="form-label">Permissions</label>
                <select
                  className="form-input"
                  value={shareForm.permissions}
                  onChange={(e) =>
                    setShareForm({
                      ...shareForm,
                      permissions: e.target.value,
                    })
                  }
                >
                  {Object.entries(PERMISSIONS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Relationship */}
              <div>
                <label className="form-label">Relationship</label>
                <select
                  className="form-input"
                  value={shareForm.relationshipType}
                  onChange={(e) =>
                    setShareForm({
                      ...shareForm,
                      relationshipType: e.target.value,
                    })
                  }
                >
                  {Object.entries(RELATIONSHIP_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="form-label">Message (Optional)</label>
                <textarea
                  rows="3"
                  className="form-input"
                  placeholder="Add a personal message..."
                  maxLength="200"
                  value={shareForm.shareMessage}
                  onChange={(e) =>
                    setShareForm({
                      ...shareForm,
                      shareMessage: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {shareForm.shareMessage.length}/200 characters
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={shareLoading}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  {shareLoading ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Share Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const DocumentCard = ({ document, onShare }) => (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="text-xl">{getFileIcon(document.mimeType)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {document.title}
            </h3>
            <p className="text-sm text-gray-500">
              {DOCUMENT_CATEGORIES[document.category]}
            </p>
            <p className="text-xs text-gray-400">
              {formatDate(document.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={() => onShare(document)}
          className="btn-primary text-sm flex items-center"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </button>
      </div>
    </div>
  );

  const SharedDocumentCard = ({ shared, type, onRevoke }) => (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="text-xl">
            {getFileIcon(shared.document?.mimeType || "application/pdf")}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {shared.document?.title}
            </h3>
            <p className="text-sm text-gray-500">
              {type === "received"
                ? `Shared by ${shared.sharedBy?.name}`
                : `Shared with ${shared.sharedWith?.name}`}
            </p>
            <p className="text-xs text-gray-400">
              {formatDate(shared.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              shared.permissions === "download"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {shared.permissions === "download" ? (
              <div className="flex items-center">
                <Download className="w-3 h-3 mr-1" />
                Download
              </div>
            ) : (
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                View
              </div>
            )}
          </span>

          {type === "sent" && onRevoke && (
            <button
              onClick={() => onRevoke(shared._id)}
              className="text-red-600 hover:bg-red-50 p-1 rounded"
              title="Revoke share"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {shared.shareMessage && (
        <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 italic">
          "{shared.shareMessage}"
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
        <span>Relationship: {RELATIONSHIP_TYPES[shared.relationshipType]}</span>
        <span
          className={`flex items-center ${
            new Date(shared.expiresAt) > new Date()
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          <Clock className="w-3 h-3 mr-1" />
          {new Date(shared.expiresAt) > new Date() ? "Active" : "Expired"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Sharing</h1>
          <p className="text-gray-600 mt-2">
            Securely share documents with your family members
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("share")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "share"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share Documents
              </div>
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "received"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Shared with Me ({sharedWithMe.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sent"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                My Shares ({mySharedDocs.length})
              </div>
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div>
            {/* Share Tab */}
            {activeTab === "share" && (
              <div>
                {documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((document) => (
                      <DocumentCard
                        key={document._id}
                        document={document}
                        onShare={handleShareDocument}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No documents to share
                    </h3>
                    <p className="text-gray-500">
                      Upload some documents first to start sharing
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Received Tab */}
            {activeTab === "received" && (
              <div>
                {sharedWithMe.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sharedWithMe.map((shared) => (
                      <SharedDocumentCard
                        key={shared._id}
                        shared={shared}
                        type="received"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No shared documents
                    </h3>
                    <p className="text-gray-500">
                      Documents shared with you will appear here
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Sent Tab */}
            {activeTab === "sent" && (
              <div>
                {mySharedDocs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mySharedDocs.map((shared) => (
                      <SharedDocumentCard
                        key={shared._id}
                        shared={shared}
                        type="sent"
                        onRevoke={handleRevokeShare}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Send className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No shared documents
                    </h3>
                    <p className="text-gray-500">
                      Documents you share will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal />
    </div>
  );
};

export default DocumentShare;
