import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from "../utils/constants";
import { formatFileSize, getFileIcon } from "../utils/helpers";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";

const DocumentUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    tags: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 5MB");
      } else {
        toast.error(
          "Invalid file type. Please upload PDF, Word documents, or images."
        );
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrors({ ...errors, file: "" });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Document title is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.type) {
      newErrors.type = "Please select a document type";
    }

    if (!file) {
      newErrors.file = "Please select a file to upload";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("document", file);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("category", formData.category);
      uploadFormData.append("type", formData.type);
      uploadFormData.append("tags", formData.tags);

      await api.post("/documents/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Document uploaded successfully!");
      navigate("/documents");
    } catch (error) {
      const message = error.response?.data?.message || "Upload failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Document</h1>
          <p className="text-gray-600 mt-2">
            Add a new document to your secure collection
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div>
              <label className="form-label">Select File</label>
              {!file ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  } ${errors.file ? "border-red-300" : ""}`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive
                      ? "Drop file here"
                      : "Choose file or drag & drop"}
                  </p>
                  <p className="text-gray-500">
                    PDF, Word documents, or images up to 5MB
                  </p>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getFileIcon(file.type)}</div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              {errors.file && <p className="form-error">{errors.file}</p>}
            </div>

            {/* Document Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="form-label">
                  Document Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className={`form-input ${
                    errors.title ? "border-red-500" : ""
                  }`}
                  placeholder="Enter document title"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <p className="form-error">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className={`form-input ${
                    errors.category ? "border-red-500" : ""
                  }`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {Object.entries(DOCUMENT_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="form-error">{errors.category}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="form-label">
                  Document Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className={`form-input ${
                    errors.type ? "border-red-500" : ""
                  }`}
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="form-error">{errors.type}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="form-input"
                placeholder="Enter document description (optional)"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="form-label">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="form-input"
                placeholder="Enter tags separated by commas (e.g., important, personal)"
                value={formData.tags}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Tags help organize and search your documents
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Security Notice</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    Your documents are encrypted and stored securely. Only you
                    and authorized family members can access them.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/documents")}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Upload Document
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

export default DocumentUpload;
