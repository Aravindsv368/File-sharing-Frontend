import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { validatePhone, validatePincode } from "../utils/helpers";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  Save,
  Edit,
  Key,
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'security', 'activity'
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
    },
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setProfileForm({
        ...profileForm,
        address: {
          ...profileForm.address,
          [addressField]: value,
        },
      });
    } else {
      setProfileForm({
        ...profileForm,
        [name]: value,
      });
    }

    // Clear errors
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileForm.name.trim() || profileForm.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!validatePhone(profileForm.phone)) {
      newErrors.phone = "Phone must be a 10-digit number";
    }

    if (
      profileForm.address.pincode &&
      !validatePincode(profileForm.address.pincode)
    ) {
      newErrors["address.pincode"] = "Pincode must be a 6-digit number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("/users/profile", profileForm);
      updateUser(response.data.user);
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    setLoading(true);
    try {
      const response = await api.post("/users/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ profilePicture: response.data.profilePicture });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="card p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profilePicture ? (
                <img
                  src={`http://localhost:5000/${user.profilePicture}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {user?.name}
            </h3>
            <p className="text-gray-500">{user?.email}</p>
            <div className="flex items-center mt-2">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">Verified Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>
          <button
            onClick={() => (editMode ? handleSaveProfile() : setEditMode(true))}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
            ) : editMode ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Edit className="w-4 h-4 mr-2" />
            )}
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="form-label">Full Name</label>
            {editMode ? (
              <input
                name="name"
                type="text"
                className={`form-input ${errors.name ? "border-red-500" : ""}`}
                value={profileForm.name}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-900 py-2">{user?.name}</p>
            )}
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="form-label">Email Address</label>
            <div className="flex items-center py-2">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="form-label">Phone Number</label>
            {editMode ? (
              <input
                name="phone"
                type="tel"
                className={`form-input ${errors.phone ? "border-red-500" : ""}`}
                value={profileForm.phone}
                onChange={handleInputChange}
              />
            ) : (
              <div className="flex items-center py-2">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900">{user?.phone || "Not provided"}</p>
              </div>
            )}
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          {/* Aadhaar (Read-only) */}
          <div>
            <label className="form-label">Aadhaar Number</label>
            <div className="flex items-center py-2">
              <Shield className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-gray-900">
                {user?.aadhaar?.replace(/(\d{4})(?=\d)/g, "$1-")}
              </p>
            </div>
            <p className="text-xs text-gray-500">Aadhaar cannot be changed</p>
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="form-label">Street Address</label>
              {editMode ? (
                <input
                  name="address.street"
                  type="text"
                  className="form-input"
                  value={profileForm.address.street}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                />
              ) : (
                <p className="text-gray-900 py-2">
                  {user?.address?.street || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="form-label">City</label>
              {editMode ? (
                <input
                  name="address.city"
                  type="text"
                  className="form-input"
                  value={profileForm.address.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              ) : (
                <p className="text-gray-900 py-2">
                  {user?.address?.city || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="form-label">State</label>
              {editMode ? (
                <input
                  name="address.state"
                  type="text"
                  className="form-input"
                  value={profileForm.address.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                />
              ) : (
                <p className="text-gray-900 py-2">
                  {user?.address?.state || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="form-label">Pincode</label>
              {editMode ? (
                <input
                  name="address.pincode"
                  type="text"
                  className={`form-input ${
                    errors["address.pincode"] ? "border-red-500" : ""
                  }`}
                  value={profileForm.address.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter pincode"
                />
              ) : (
                <p className="text-gray-900 py-2">
                  {user?.address?.pincode || "Not provided"}
                </p>
              )}
              {errors["address.pincode"] && (
                <p className="form-error">{errors["address.pincode"]}</p>
              )}
            </div>
          </div>
        </div>

        {editMode && (
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setEditMode(false);
                setProfileForm({
                  name: user?.name || "",
                  phone: user?.phone || "",
                  address: {
                    street: user?.address?.street || "",
                    city: user?.address?.city || "",
                    state: user?.address?.state || "",
                    pincode: user?.address?.pincode || "",
                  },
                });
                setErrors({});
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Account Security */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Account Security
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-900">Email Verified</p>
                <p className="text-sm text-green-700">
                  Your email address is verified and secure
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <Key className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-yellow-900">Password</p>
                <p className="text-sm text-yellow-700">
                  Last changed 30 days ago
                </p>
              </div>
            </div>
            <button className="btn-secondary text-sm">Change Password</button>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-blue-700">
                  Add an extra layer of security
                </p>
              </div>
            </div>
            <button className="btn-secondary text-sm">Enable 2FA</button>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Data & Privacy
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Download My Data</p>
              <p className="text-sm text-gray-500">
                Get a copy of all your data
              </p>
            </div>
            <button className="btn-secondary text-sm">Download</button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and data
              </p>
            </div>
            <button className="btn-danger text-sm">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityTab = () => (
    <div className="space-y-6">
      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">
            {user?.documentsCount || 0}
          </p>
          <p className="text-gray-600">Documents Uploaded</p>
        </div>

        <div className="card p-6 text-center">
          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">
            {user?.createdAt
              ? Math.floor(
                  (new Date() - new Date(user.createdAt)) /
                    (1000 * 60 * 60 * 24)
                )
              : 0}
          </p>
          <p className="text-gray-600">Days Active</p>
        </div>

        <div className="card p-6 text-center">
          <User className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">
            {user?.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString()
              : "Today"}
          </p>
          <p className="text-gray-600">Last Login</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            Activity tracking will be available soon
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "profile", name: "Profile", icon: User },
              { id: "security", name: "Security", icon: Shield },
              { id: "activity", name: "Activity", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "activity" && <ActivityTab />}
      </div>
    </div>
  );
};

export default Profile;
