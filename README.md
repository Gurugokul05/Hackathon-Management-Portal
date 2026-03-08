# 🏆 Hackathon Management Platform

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/gurugokul05/Hackathon-Management-Portal/graphs/commit-activity)

</div>

> A comprehensive, production-ready full-stack web application designed to streamline hackathon event management from registration to results. Built with modern technologies and optimized for handling multiple concurrent users efficiently.

## � Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Security Notes](#-security-notes)
- [Testing](#-testing)
- [Performance Optimization](#-performance-optimization)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Use Cases](#-use-cases)
- [Contributing](#-contributing)
- [License](#-license)

## �📖 About

This platform provides end-to-end hackathon management capabilities for organizers and participants. It eliminates the complexity of managing teams, tracking attendance, evaluating submissions, and maintaining transparent communication throughout the event. Whether you're organizing a small college hackathon or a large-scale competition, this platform scales to meet your needs.

**Perfect for:** Colleges, universities, tech communities, corporate hackathons, and innovation challenges.

## ✨ Key Features

### 👥 Team Management

- **Smart Registration System**: Multi-step team registration with leader and member details
- **Email Verification**: Automated email confirmations with team credentials
- **Team Profiles**: Comprehensive team information with member roles
- **Data Export**: Export team data to Excel for offline analysis
- **Team Authentication**: Secure JWT-based login system for teams

### 📋 Problem Statement Management

- **Dynamic Problem Creation**: Admin interface for creating and managing problem statements
- **Rich Problem Details**: Support for descriptions, difficulty levels, and tags
- **Real-time Updates**: Problems are instantly available to all registered teams
- **Problem Assignment**: Track which teams are working on which problems

### 📤 Submission System

- **File Upload**: Secure file upload system for project submissions
- **Multiple Formats**: Support for various file types (code, documents, presentations)
- **Submission Tracking**: Real-time tracking of all team submissions
- **Marks Management**: Admin panel for evaluating and assigning marks
- **Submission History**: Complete audit trail of all submissions

### 📊 Attendance Management

- **Real-time Tracking**: Mark team attendance with timestamps
- **Lock Mechanism**: Smart attendance locks to prevent duplicate entries
- **Attendance Export**: Export attendance records to Excel
- **Participation Analytics**: Track team participation throughout the event
- **Manual Override**: Admin controls for attendance adjustments

### 🏅 Leaderboard System

- **Dynamic Rankings**: Real-time leaderboard based on submission marks
- **Multiple Sort Options**: Sort by marks, team name, or submission time
- **Public Display**: Shareable leaderboard for transparent competition
- **Performance Metrics**: Visual representation of team standings

### 💬 Communication Hub

- **Notice Board**: Broadcast important announcements to all teams
- **Complaint System**: Structured complaint submission and tracking
- **Priority Management**: Mark urgent notices for better visibility
- **Communication History**: Archive of all notices and complaints

### 🔐 Admin Dashboard

- **Multi-Admin Support**: Create and manage multiple admin accounts
- **Role-Based Access Control**: Assign specific permissions to different admins
- **Staff vs Super Admin**: Hierarchical admin roles with different privileges
- **Admin Activity Logs**: Track admin actions for accountability
- **Centralized Control**: Single dashboard for all management tasks

### ⚙️ Event Settings

- **Event Configuration**: Customize event name, dates, and details
- **Dynamic Settings**: Update event parameters without code changes
- **Gallery Management**: Upload and manage event photos
- **Customizable Rules**: Set event-specific rules and guidelines

### 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for all passwords
- **Rate Limiting**: Protection against brute force attacks
- **Helmet Security**: HTTP security headers
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Input Validation**: Comprehensive request validation

### ⚡ Performance Optimizations

- **Response Compression**: Gzip compression for faster data transfer
- **Request Caching**: Smart caching for frequently accessed data
- **Connection Pooling**: Optimized MongoDB connection management
- **Code Splitting**: Lazy loading for faster initial page loads
- **Image Optimization**: Efficient asset delivery
- **Database Indexing**: Optimized queries for quick data retrieval

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, bcrypt, express-rate-limit
- **File Upload**: Multer
- **Email**: Nodemailer
- **Performance**: Compression, request caching

### Frontend

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios with interceptors
- **UI/UX**: Framer Motion, SweetAlert2
- **Icons**: React Icons
- **Styling**: CSS3 with modern features
- **Build Tool**: Vite (Lightning-fast HMR)

### Development Tools

- **Code Quality**: ESLint
- **Version Control**: Git
- **API Testing**: Artillery (load testing included)
- **Environment Management**: dotenv

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Gurugokul05/Hackathon-Management-Portal.git
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Create `.env` file

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/hackathon_db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h

# CORS allowed origins
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Create Admin Account

```bash
node create-admin.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### Create `.env` file

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file if needed (default points to localhost:5000):

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Backend in Production

```bash
cd backend
NODE_ENV=production npm start
```

## 📁 Project Structure

```
.
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── uploads/        # File uploads directory
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   ├── services/   # API services
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
└── README.md
```

## 🔐 Security Notes

- **Never commit `.env` files** to version control
- Change default admin credentials immediately after deployment
- Use strong JWT secrets in production
- Enable HTTPS in production
- Review and update CORS origins for production URLs
- For Gmail: Enable 2FA and use App Passwords

## 🧪 Testing

### Test Attendance System

```bash
cd backend
node test-attendance-api.js
```

### Test Admin Account

```bash
cd backend
node quick-test.js
```

## 📊 Performance Optimization

The application includes several performance optimizations:

- **Backend Optimizations**:
  - Response compression with gzip
  - Request caching for frequently accessed data
  - MongoDB connection pooling (10-50 connections)
  - Rate limiting to prevent abuse
  - Efficient database indexing

- **Frontend Optimizations**:
  - Code splitting and lazy loading
  - Component-level code splitting
  - Request caching with 1-minute TTL
  - Optimized bundle size with tree-shaking
  - Image lazy loading
  - Production build minification

- **Database Optimizations**:
  - Indexed fields for faster queries
  - Optimized aggregation pipelines
  - Efficient pagination

See [OPTIMIZATION_GUIDE.md](OPTIMIZATION_GUIDE.md) for detailed information.

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Set environment variable:

```env
VITE_API_URL=https://your-backend-api.com/api
```

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Set `NODE_ENV=production`
4. Deploy using Git or Docker

### Environment Variables for Production

**Backend:**

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=strong_random_secret_at_least_32_characters
CORS_ORIGINS=https://your-frontend-domain.com
NODE_ENV=production
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Frontend:**

```env
VITE_API_URL=https://your-backend-api.com/api
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**

- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGO_URI` in `.env` is correct
- Check firewall settings and network access

**CORS Errors**

- Update `CORS_ORIGINS` in backend `.env` to include your frontend URL
- Ensure frontend is using correct API URL

**JWT Token Errors**

- Clear localStorage in browser
- Ensure `JWT_SECRET` is set in backend `.env`
- Check token expiry settings

**File Upload Issues**

- Verify `uploads` directory exists with write permissions
- Check file size limits in backend configuration
- Ensure correct `multipart/form-data` content type

**Email Not Sending**

- Enable 2FA on Gmail and create App Password
- Update `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Check email service configuration

## 📖 Documentation

- [Optimization Guide](OPTIMIZATION_GUIDE.md) - Detailed performance optimization strategies
- [Optimization Quick Start](OPTIMIZATION_QUICK_START.md) - Quick optimization checklist
- [Attendance Lock Implementation](ATTENDANCE_LOCK_IMPLEMENTATION.md) - Attendance system architecture

## 🎯 Use Cases

This platform is ideal for:

- **College Hackathons**: Manage student teams and track projects
- **Corporate Innovation Challenges**: Internal hackathons for employees
- **Community Tech Events**: Open hackathons for local developer communities
- **Online Coding Competitions**: Virtual hackathons with remote teams
- **Ideathons & Pitch Competitions**: Adapt for idea submission and evaluation

## 🌟 Highlights

- ✅ **Production-Ready**: Built with security and scalability in mind
- ✅ **Mobile Responsive**: Works seamlessly on all device sizes
- ✅ **Real-Time Updates**: Live leaderboard and attendance tracking
- ✅ **Easy Deployment**: Simple setup with comprehensive documentation
- ✅ **Extensible**: Modular architecture for easy customization
- ✅ **Well-Documented**: Extensive comments and documentation
- ✅ **Performance Tested**: Includes Artillery load testing configuration
- ✅ **Modern Stack**: Built with latest versions of React, Node.js, and MongoDB

## 📚 API Documentation

### Authentication Endpoints

#### Team Authentication

- `POST /api/auth/register` - Register new team with members
- `POST /api/auth/login` - Team login (returns JWT token)
- `GET /api/auth/me` - Get current authenticated user/team

#### Admin Authentication

- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/admin/me` - Get current admin details

### Team Management

- `GET /api/teams` - Get all registered teams (with pagination)
- `GET /api/teams/:id` - Get specific team details
- `PUT /api/teams/:id` - Update team information
- `DELETE /api/teams/:id` - Delete team (Admin only)
- `GET /api/teams/export` - Export teams to Excel (Admin only)
- `POST /api/teams/:id/attendance` - Mark team attendance

### Problem Statements

- `GET /api/problems` - Get all problem statements
- `GET /api/problems/:id` - Get specific problem details
- `POST /api/problems` - Create new problem (Admin only)
- `PUT /api/problems/:id` - Update problem (Admin only)
- `DELETE /api/problems/:id` - Delete problem (Admin only)

### Submissions

- `POST /api/submissions` - Submit project solution (with file upload)
- `GET /api/submissions` - Get all submissions (filtered by team/admin)
- `GET /api/submissions/:id` - Get specific submission
- `PUT /api/submissions/:id/marks` - Update submission marks (Admin only)
- `DELETE /api/submissions/:id` - Delete submission (Admin only)

### Communication

- `GET /api/communication/notices` - Get all notices
- `POST /api/communication/notices` - Create notice (Admin only)
- `PUT /api/communication/notices/:id` - Update notice (Admin only)
- `DELETE /api/communication/notices/:id` - Delete notice (Admin only)
- `GET /api/communication/complaints` - Get all complaints
- `POST /api/communication/complaints` - Submit complaint (Team)
- `PUT /api/communication/complaints/:id` - Update complaint status (Admin only)

### Admin Management

- `GET /api/admins` - Get all admins (Super Admin only)
- `POST /api/admins` - Create new admin (Super Admin only)
- `PUT /api/admins/:id` - Update admin details/permissions (Super Admin only)
- `DELETE /api/admins/:id` - Delete admin (Super Admin only)

### Settings

- `GET /api/settings` - Get event settings
- `PUT /api/settings` - Update event settings (Admin only)

### Attendance

- `GET /api/teams/attendance/export` - Export attendance to Excel (Admin only)

**Note**: All endpoints requiring authentication need a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Write clean, documented code
- Follow existing code style and conventions
- Test your changes thoroughly
- Update documentation as needed
- Keep commits atomic and well-described

## 🔄 Changelog

### Version 1.0.0 (Current)

- ✅ Complete team registration and authentication system
- ✅ Admin dashboard with role-based access control
- ✅ Problem statement management
- ✅ Submission system with file uploads
- ✅ Real-time leaderboard
- ✅ Attendance tracking with export
- ✅ Communication hub (notices & complaints)
- ✅ Event settings management
- ✅ Performance optimizations
- ✅ Security hardening

## 📸 Screenshots

_Coming soon - Add screenshots of your deployed application here_

### User Views

- Landing Page
- Team Registration
- Team Dashboard
- Problem Statements
- Leaderboard

### Admin Views

- Admin Dashboard
- Team Management
- Submission Review
- Attendance Tracking
- Communication Manager

## 🛣️ Roadmap

Future enhancements planned:

- [ ] Real-time chat between teams and admins
- [ ] Automated code evaluation for programming challenges
- [ ] Team collaboration tools
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with GitHub for code submissions
- [ ] Video submission support
- [ ] Mentor assignment system
- [ ] Sponsorship management
- [ ] Certificate generation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_

## 🙏 Acknowledgments

- Built with ❤️ for the hackathon community
- Inspired by the need for efficient event management
- Thanks to all contributors and testers

## 📞 Support & Contact

- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Email**: your-email@example.com
- **Documentation**: Check the docs folder for detailed guides

## ⚖️ Security

If you discover a security vulnerability, please email security@example.com instead of using the issue tracker.

## 📈 Stats

- **Lines of Code**: ~10,000+
- **Components**: 25+ React components
- **API Endpoints**: 30+ RESTful endpoints
- **Database Models**: 8 MongoDB schemas
- **Performance**: Optimized for 300+ concurrent users

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for Hackathon Organizers

[Report Bug](https://github.com/gurugokul05/Hackathon-Management-Portal/issues) · [Request Feature](https://github.com/gurugokul05/Hackathon-Management-Portal/issues) · [Documentation](https://github.com/gurugokul05/Hackathon-Management-Portal/wiki)

</div>
