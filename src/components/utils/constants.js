export const DOCUMENT_CATEGORIES = {
  education: "Education",
  healthcare: "Healthcare",
  railway: "Railway",
  identity: "Identity",
  financial: "Financial",
  legal: "Legal",
  other: "Other",
};

export const DOCUMENT_TYPES = {
  marksheet: "Marksheet",
  certificate: "Certificate",
  pan_card: "PAN Card",
  aadhaar: "Aadhaar Card",
  passport: "Passport",
  driving_license: "Driving License",
  other: "Other",
};

export const RELATIONSHIP_TYPES = {
  father: "Father",
  mother: "Mother",
  spouse: "Spouse",
  child: "Child",
  sibling: "Sibling",
  other: "Other",
};

export const PERMISSIONS = {
  view: "View Only",
  download: "View & Download",
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
