# Google Form Question Uploader

[![GitHub stars](https://img.shields.io/github/stars/Elphast24/Google-Form-Question-Uploader?style=social)](https://github.com/Elphast24/Google-Form-Question-Uploader/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Elphast24/Google-Form-Question-Uploader?style=social)](https://github.com/Elphast24/Google-Form-Question-Uploader/network)
[![GitHub issues](https://img.shields.io/github/issues/Elphast24/Google-Form-Question-Uploader)](https://github.com/Elphast24/Google-Form-Question-Uploader/issues)
[![GitHub license](https://img.shields.io/github/license/Elphast24/Google-Form-Question-Uploader)](https://github.com/Elphast24/Google-Form-Question-Uploader/blob/main/LICENSE)
[![Node.js Version](https://img.shields.io/node-version/16+/node)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/React-19-blue)](https://react.dev)

AI-Powered Google Form Generator that automatically converts DOCX, PDF, or TXT question files into structured Google Forms. Using Gemini AI, it detects question types, extracts options, organizes sections, and provides a clean preview with direct export to Google Forms.

## ✨ Features

- 📄 **File Upload** - Support for DOCX, PDF, and TXT files
- 🤖 **AI-Powered** - Gemini AI intelligently processes questions
- 🔍 **Auto-Detection** - Automatically identifies question types (Multiple Choice, Short Answer, etc.)
- 📋 **Live Preview** - Preview forms before creating them
- 🔗 **Google Integration** - Direct export to Google Forms
- 👥 **User Authentication** - Google OAuth integration
- 💾 **Form Storage** - Save and manage created forms

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Google Cloud Console project
- Gemini AI API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/Google-Form-Question-Uploader.git
cd Google-Form-Question-Uploader
```

2. **Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:5173`

## 📝 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:5173

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### Required API Setup

1. **Firebase** - Create a project at [Firebase Console](https://console.firebase.google.com/)
2. **Google Cloud** - Enable Google Forms API, Drive API at [Google Cloud Console](https://console.cloud.google.com/)
3. **Gemini AI** - Get API key at [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- Firebase Admin SDK
- Google APIs (OAuth2, Forms, Drive)
- Gemini AI

### Frontend
- React 19
- Vite
- Material UI
- React Router
- Firebase Client SDK

## 📂 Project Structure

```
Google-Form-Question-Uploader/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── test/            # Test files
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── styles/      # Styling
│   ├── index.html
│   └── package.json
├── .github/             # GitHub templates
├── LICENSE              # MIT License
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Forms API](https://developers.google.com/forms/api)
- [Gemini AI](https://ai.google.dev/)
- [Firebase](https://firebase.google.com/)

## 🔧 Troubleshooting

### Common Issues

**Firebase Admin SDK initialization error**
- Verify `serviceAccountKey.json` path in `.env`

**Google OAuth redirect URI mismatch**
- Ensure redirect URI in Google Console matches `.env` exactly

**Gemini API quota exceeded**
- Check API usage in Google AI Studio

**CORS errors**
- Update `CLIENT_URL` in `.env` to match frontend origin

---

<p align="center">Made with ❤️ by the community</p>

