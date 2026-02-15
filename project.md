# AI-Powered Google Form Generator - Backend Setup

## 📁 Folder Structure

```
ai-form-generator-backend/
├── config/
│   ├── firebase.js
│   ├── googleAuth.js
│   └── serviceAccountKey.json (gitignored)
├── controllers/
│   ├── authController.js
│   ├── uploadController.js
│   └── formController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── fileValidation.js
├── routes/
│   ├── index.js
│   ├── auth.js
│   ├── upload.js
│   └── forms.js
├── services/
│   ├── fileParserService.js
│   ├── geminiService.js
│   └── googleFormsService.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Google Cloud Console project
- Gemini AI API key

### 2. Clone and Install

```bash
# Create project directory
mkdir ai-form-generator-backend
cd ai-form-generator-backend

# Initialize npm
npm init -y

# Install dependencies
npm install express cors dotenv helmet morgan multer firebase-admin googleapis @google/generative-ai mammoth

# Install dev dependencies
npm install --save-dev nodemon
```

### 3. Firebase Setup

#### Step 3.1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name and follow setup wizard
4. Enable Google Analytics (optional)

#### Step 3.2: Enable Firebase Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Google" sign-in provider
4. Add your domain to authorized domains

#### Step 3.3: Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select database location
5. Create collections:
   - `users` (will be auto-created)
   - `forms` (will be auto-created)

#### Step 3.4: Generate Service Account Key
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save as `config/serviceAccountKey.json`
4. **IMPORTANT**: Add to `.gitignore`

### 4. Google Cloud Console Setup

#### Step 4.1: Create OAuth 2.0 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new)
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Save Client ID and Client Secret

#### Step 4.2: Enable Required APIs
1. Go to "APIs & Services" > "Library"
2. Search and enable:
   - Google Forms API
   - Google Drive API
   - Google People API

### 5. Gemini AI API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy the key for `.env` file

### 6. Environment Configuration

Create `.env` file in root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### 7. Create Folder Structure

```bash
# Create all necessary folders
mkdir config controllers middleware routes services

# Create necessary files
touch server.js
touch config/firebase.js config/googleAuth.js
touch controllers/authController.js controllers/uploadController.js controllers/formController.js
touch middleware/auth.js middleware/errorHandler.js middleware/fileValidation.js
touch routes/index.js routes/auth.js routes/upload.js routes/forms.js
touch services/fileParserService.js services/geminiService.js services/googleFormsService.js
```

### 8. Create .gitignore

```gitignore
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.development
.env.production

# Firebase
config/serviceAccountKey.json

# Logs
logs/
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
dist/
build/
```

### 9. Update package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 10. Firestore Security Rules

In Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Forms collection
    match /forms/{formId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### 11. Run the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

### 12. Test Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Get Google OAuth URL
curl http://localhost:5000/api/auth/google
```

## 🔐 Security Checklist

- ✅ Service account key in `.gitignore`
- ✅ `.env` file in `.gitignore`
- ✅ Firestore security rules configured
- ✅ CORS configured for specific origins
- ✅ Helmet.js for security headers
- ✅ File upload size limits (10MB)
- ✅ File type validation (DOCX, TXT only)
- ✅ Authentication middleware on protected routes

## 📝 Important Notes

1. **Never commit** `serviceAccountKey.json` or `.env` to version control
2. **Update** `CLIENT_URL` in `.env` for production
3. **Update** Google OAuth redirect URIs for production domain
4. **Review** Firestore security rules before production deployment
5. **Set** appropriate CORS origins for production
6. **Enable** rate limiting for production (consider express-rate-limit)

## 🧪 Testing the Setup

### Test File Upload
```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -F "file=@sample.txt"
```

### Test Form Generation
```bash
curl -X POST http://localhost:5000/api/forms/generate \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Form",
    "questions": [
      {
        "question_text": "What is your name?",
        "question_type": "SHORT_ANSWER",
        "required": true
      }
    ]
  }'
```

### Test Get User Forms
```bash
curl -X GET http://localhost:5000/api/forms \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

## 🚨 Troubleshooting

### Issue: Firebase Admin SDK initialization error
**Solution**: Verify `serviceAccountKey.json` path in `.env`

### Issue: Google OAuth redirect URI mismatch
**Solution**: Ensure redirect URI in Google Console matches `.env` exactly

### Issue: Gemini API quota exceeded
**Solution**: Check API usage in Google AI Studio, upgrade plan if needed

### Issue: Google Forms API access denied
**Solution**: Verify Forms API is enabled in Google Cloud Console

### Issue: CORS errors
**Solution**: Update `CLIENT_URL` in `.env` to match frontend origin

## 📚 Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Google Forms API Documentation](https://developers.google.com/forms/api)
- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gemini AI Documentation](https://ai.google.dev/docs)
- [Express.js Documentation](https://expressjs.com/)

## 🎯 Next Steps

1. Copy all code files from previous artifact
2. Follow setup instructions above
3. Test all endpoints
4. Deploy to production (Heroku, Railway, Google Cloud Run, etc.)
5. Update environment variables for production
6. Configure custom domain
7. Set up monitoring and logging