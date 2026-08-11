# Modi Medical - Vercel Deployment

Modi Medical Wholesale Distributor Web Application deployed on Vercel.

## 🌐 Live Application
- **Frontend**: Static files served via Vercel CDN
- **Backend**: FastAPI deployed as Vercel Serverless Functions
- **Database**: SQLite (serverless-compatible)

## 🚀 Deployment Details

### Tech Stack
- **Frontend**: HTML, CSS, JavaScript (static files)
- **Backend**: FastAPI with serverless adaptation
- **Hosting**: Vercel (Free tier)
- **Database**: SQLite (ephemeral in serverless)

### Architecture
```
Vercel Deployment
├── Frontend (public/)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── assets/
└── Backend (api/)
    ├── index.py (serverless entry point)
    ├── main.py (FastAPI application)
    └── requirements.txt
```

### API Endpoints
- `GET /health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/users` - Get users
- `POST /api/users` - Create user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/medicines` - Get medicines
- `POST /api/medicines` - Create medicine

### Default Credentials
- **Username**: admin
- **Password**: password
- **Note**: Change default password after first login

## ⚠️ Important Notes

### Database Limitations
- SQLite in serverless environment is **ephemeral** (data resets on redeployment)
- For production persistence, consider:
  - Vercel Postgres (paid tiers available)
  - External database (Supabase, Neon, Railway)
  - Vercel Blob for file storage

### Free Tier Limitations
- **Vercel Hobby Plan**: 
  - 100GB bandwidth/month
  - 6GB serverless execution
  - Unlimited deployments
- **Database**: Currently using ephemeral SQLite (free but temporary)

### Data Persistence
- Current setup uses localStorage for frontend data
- Backend uses SQLite (temporary in serverless)
- For permanent data, upgrade to external database

## 🔧 Configuration

### Environment Variables
Set these in Vercel Project Settings:
- `DB_PATH`: Database path (default: `/tmp/modi_medical.db`)
- `PYTHON_VERSION`: Python version (default: `3.12`)

### API Configuration
Frontend automatically detects API URL:
```javascript
apiBaseUrl: window.location.origin + '/api'
```

## 📊 Performance

### Frontend
- Static files served from Vercel CDN
- Global edge network
- Automatic HTTPS
- Image optimization

### Backend
- Serverless functions scale automatically
- Cold starts on first request (~1-2 seconds)
- Automatic scaling based on traffic

## 🚦 Next Steps for Production

1. **Database Migration**
   - Set up Vercel Postgres or external database
   - Migrate existing data
   - Update database connection strings

2. **Custom Domain**
   - Add custom domain in Vercel dashboard
   - Configure DNS records
   - SSL automatically configured

3. **Monitoring**
   - Enable Vercel Analytics
   - Set up error tracking
   - Configure uptime monitoring

4. **Security**
   - Add environment variables for secrets
   - Enable rate limiting
   - Configure authentication

## 📝 Deployment Commands

### Local Development
```bash
# Test locally with Docker
docker-compose up -d --build
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

## 🆘 Troubleshooting

### Common Issues

**Database resets on deployment**
- Current: SQLite is ephemeral in serverless
- Solution: Use external database for persistence

**Cold start delays**
- Normal behavior for serverless functions
- Typically 1-2 seconds on first request
- Subsequent requests are faster

**API connection errors**
- Check API URL configuration
- Verify environment variables
- Check Vercel function logs

## 📞 Support

For issues or questions:
- Check Vercel deployment logs
- Review function logs in Vercel dashboard
- Test API endpoints via `/docs` (if available)

---

**Generated with [Devin](https://devin.ai)**