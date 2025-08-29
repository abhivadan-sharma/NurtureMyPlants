# Claude Development Instructions

## Starting the Application

This is a full-stack application with separate backend and frontend servers.

### Quick Start Commands

**Backend** (runs on port 3002):
```bash
cd backend
npm run dev
```

**Frontend** (runs on port 5173+ - Vite will find next available port):
```bash
cd frontend  
npm run dev
```

### Troubleshooting

If backend fails with "EADDRINUSE" error on port 3002:
1. Check what's using the port: `netstat -ano | findstr :3002`
2. Kill the process: `taskkill //PID <PID_NUMBER> //F`
3. Restart backend server

### Development URLs

- **Backend API**: http://localhost:3002
- **Frontend**: http://localhost:5173 (or next available port)
- **Health Check**: http://localhost:3002/health

### Project Structure

- `backend/` - Node.js/Express API with TypeScript
- `frontend/` - React/Vite application with TypeScript
- `sample-images/` - Test images for plant identification
- `sample-pdfs/` - Generated care guide PDFs