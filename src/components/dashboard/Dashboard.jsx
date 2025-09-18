import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  FileText,
  Upload,
  Share2,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Plus,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    sharedDocuments: 0,
    recentDocuments: [],
    sharedWithMe: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [documentsRes, sharedRes] = await Promise.all([
        api.get("/documents?limit=5"),
        api.get("/share/received"),
      ]);

      setStats({
        totalDocuments: documentsRes.data.total || 0,
        sharedDocuments: sharedRes.data.sharedDocuments?.length || 0,
        recentDocuments: documentsRes.data.documents || [],
        sharedWithMe: sharedRes.data.sharedDocuments?.slice(0, 3) || [],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <div className={`card p-6 ${link ? "card-hover" : ""}`}>
      <Link to={link || "#"} className={link ? "" : "pointer-events-none"}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
          <div
            className={`p-3 rounded-full ${color
              .replace("text", "bg")
              .replace("-600", "-100")}`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </Link>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, link, color }) => (
    <Link to={link} className="card-hover p-6 group">
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-lg ${color
            .replace("text", "bg")
            .replace("-600", "-100")} group-hover:${color
            .replace("text", "bg")
            .replace("-600", "-200")} transition-colors`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your secure government documents efficiently and safely.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="My Documents"
            value={stats.totalDocuments}
            icon={FileText}
            color="text-blue-600"
            link="/documents"
          />
          <StatCard
            title="Shared with Me"
            value={stats.sharedDocuments}
            icon={Users}
            color="text-green-600"
            link="/share"
          />
          <StatCard
            title="Storage Used"
            value="2.4 GB"
            icon={TrendingUp}
            color="text-purple-600"
          />
          <StatCard
            title="Last Activity"
            value="2 hrs ago"
            icon={Clock}
            color="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickAction
                title="Upload Document"
                description="Add new documents to your secure vault"
                icon={Upload}
                link="/upload"
                color="text-blue-600"
              />
              <QuickAction
                title="Share Documents"
                description="Share documents securely with family members"
                icon={Share2}
                link="/share"
                color="text-green-600"
              />
              <QuickAction
                title="View All Documents"
                description="Browse and manage your document collection"
                icon={FileText}
                link="/documents"
                color="text-purple-600"
              />
              <QuickAction
                title="Security Settings"
                description="Manage your account and security preferences"
                icon={Shield}
                link="/profile"
                color="text-red-600"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Activity
            </h2>

            {/* Recent Documents */}
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Recent Documents
                </h3>
                <Link
                  to="/documents"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View all
                </Link>
              </div>

              {stats.recentDocuments.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentDocuments.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No documents yet</p>
                  <Link
                    to="/upload"
                    className="btn-primary inline-flex items-center mt-3"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload First Document
                  </Link>
                </div>
              )}
            </div>

            {/* Shared Documents */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Shared with Me</h3>
                <Link
                  to="/share"
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  View all
                </Link>
              </div>

              {stats.sharedWithMe.length > 0 ? (
                <div className="space-y-3">
                  {stats.sharedWithMe.map((shared) => (
                    <div
                      key={shared._id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {shared.document?.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          by {shared.sharedBy?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No shared documents</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900">Security Reminder</h3>
              <p className="text-blue-800 mt-1">
                Your documents are encrypted and secure. Never share your login
                credentials with anyone. Always log out when using shared
                computers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
