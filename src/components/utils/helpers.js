export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-IN", options);
};

export const getFileIcon = (mimeType) => {
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("image")) return "🖼️";
  if (mimeType.includes("word")) return "📝";
  return "📁";
};

export const validateAadhaar = (aadhaar) => {
  return /^\d{12}$/.test(aadhaar);
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const validatePincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};

export const validateEmail = (email) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};
