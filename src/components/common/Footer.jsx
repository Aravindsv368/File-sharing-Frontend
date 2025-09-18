import React from "react";
import { FileText, Shield, Users, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Secure Gov Docs</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              A secure digital platform for storing, managing, and sharing
              government documents with your family members. Built with security
              and privacy in mind.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>End-to-End Security</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>Family Sharing</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/documents"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  My Documents
                </a>
              </li>
              <li>
                <a
                  href="/upload"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Upload Document
                </a>
              </li>
              <li>
                <a
                  href="/share"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Share Documents
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@securegovdocs.com</span>
              </div>
              <p className="text-sm text-gray-400">
                Available 24/7 for assistance
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Secure Government Documents. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
