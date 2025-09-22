# Secure Government Document Management System

A comprehensive MERN stack application for securely storing, managing, and sharing government documents with family members. Built with modern security practices, responsive design, and development-friendly features.

---

## 🌟 Features

### 🔐 Authentication & Security
- User Registration with Aadhaar validation and email OTP verification  
- Mock Email Service for development (no real email setup required)  
- JWT-based Authentication with secure token management  
- Password Encryption using bcryptjs with salt rounds  
- Rate Limiting to prevent API abuse  
- Input Validation & Sanitization on all endpoints  
- Comprehensive Logging with Winston for audit trails  

### 📁 Document Management
- Secure Document Upload (PDF, Images, Word documents up to 5MB)  
- File Type Validation and security checks  
- Document Categorization (Education, Healthcare, Railway, Identity, Financial, Legal)  
- Document Types (Marksheet, Certificate, PAN Card, Aadhaar, Passport, etc.)  
- Advanced Search & Filter functionality  
- Document Tagging system for better organization  
- Real-time Storage Calculation and usage tracking  
- CRUD Operations with proper authorization  

### 👨‍👩‍👧‍👦 Family Sharing
- Secure Document Sharing with family members via email  
- Permission Management (View-only or Download access)  
- Relationship Tracking (Father, Mother, Spouse, Child, Sibling)  
- Share Messages for context and communication  
- Share Expiration (30-day default with active status tracking)  
- Revoke Sharing capability for document owners  
- Shared Document Download with proper access control  

### 👤 User Management
- Profile Management with picture upload  
- Address Information storage and validation  
- Account Activity tracking with real-time data  
- Security Settings overview  
- Form Focus Management (no cursor jumping issues)  

### 📱 User Experience
- Fully Responsive Design (desktop, tablet, mobile optimized)  
- Modern UI with Tailwind CSS and smooth animations  
- Interactive Components with proper loading states  
- Real-time Notifications using React Hot Toast  
- Intuitive Navigation with protected routes  
- Debug Mode for development with console logging  

### 📊 Logging & Monitoring
- Mock Email Logging with file storage and console output  
- Request/Response Logging for all API calls  
- Error Tracking with detailed stack traces  
- Authentication Event Logs for security monitoring  
- File Operation Logs for document management  
- Development Email Viewer for testing  

---

## ⚙️ Environment Configuration

Create a `.env` file inside the **server/** directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/secure-gov-docs

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-complex-for-security
JWT_EXPIRE=30d

# Mock Email Configuration
EMAIL_MODE=mock
EMAIL_SERVICE=mock
EMAIL_USER=noreply@securegovdocs.dev
EMAIL_PASS=not-needed-in-mock-mode
SHOW_OTP_IN_RESPONSE=true
LOG_EMAILS_TO_FILE=true

# File Upload Settings
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# 🚀 Access the Application

## Frontend
- **URL:** [http://localhost:3000](http://localhost:3000)

## Backend API
- **URL:** [http://localhost:5000](http://localhost:5000)

## Health Check
- **Endpoint:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

# 📧 Email System (Development Mode)

## Mock Email Service Features
- No real email setup required – works with any dummy email  
- OTP displayed in console – easy to copy for testing  
- OTP included in API response (**development only**)  
- Email files saved locally – can view formatted emails  
- Development email viewer – browse sent emails via API  

## Email Viewing Options
- **Console:** OTP displayed prominently in terminal  
- **API Response:** `developmentOTP` field in registration/resend responses  
- **Files:** Saved in `server/emails/` directory  
- **Viewer:** [http://localhost:5000/api/dev/emails](http://localhost:5000/api/dev/emails)

---

# 🔌 API Endpoints

## Authentication
- **POST** `/api/auth/register` – User registration (returns OTP in development)  
- **POST** `/api/auth/verify-otp` – Email verification  
- **POST** `/api/auth/resend-otp` – Resend OTP (returns OTP in development)  
- **POST** `/api/auth/login` – User login  
- **POST** `/api/auth/logout` – User logout  
- **GET** `/api/auth/me` – Get current user  

## Documents
- **POST** `/api/documents/upload` – Upload document (multipart/form-data)  
- **GET** `/api/documents` – Get user documents (pagination, search, filters)  
- **GET** `/api/documents/:id` – Get single document  
- **GET** `/api/documents/:id/download` – Download document (supports shared access)  
- **PUT** `/api/documents/:id` – Update document metadata  
- **DELETE** `/api/documents/:id` – Delete document  

## Document Sharing
- **POST** `/api/share/document` – Share document with family member  
- **GET** `/api/share/received` – Get documents shared with me  
- **GET** `/api/share/sent` – Get documents I shared  
- **DELETE** `/api/share/:shareId` – Revoke document share  

## User Management
- **PUT** `/api/users/profile` – Update profile information  
- **POST** `/api/users/profile-picture` – Upload profile picture (multipart/form-data)  

## Development Tools
- **GET** `/api/health` – Health check endpoint  
- **GET** `/api/dev/emails` – List mock emails (development only)  
- **GET** `/api/dev/emails/:filename` – View specific email (development only)  
- **DELETE** `/api/dev/emails` – Clear all mock emails (development only)  

---

# 🔒 Security Features

## Data Protection
- Password Hashing with **bcrypt** (12 salt rounds)  
- JWT Tokens with expiration and secure generation  
- Input Validation using **express-validator**  
- File Upload Security with type and size validation  
- SQL Injection Prevention using **Mongoose ODM**  
- XSS Protection with input sanitization  

## API Security
- **Helmet** for setting secure HTTP headers  
- **CORS configuration** with restricted origins  
- **Rate Limiting** to protect against brute-force attacks  
- **Centralized Error Handling** with proper status codes  

## Logging & Monitoring
- Authentication Events logged (login, logout, failed attempts)  
- File Operations logged (upload, download, delete)  
- Request/Response Logging for audit trails  
- Error Tracking with detailed stack traces in development  
- Mock Email Logging saved to files and console  

# Client URL
CLIENT_URL=http://localhost:3000
