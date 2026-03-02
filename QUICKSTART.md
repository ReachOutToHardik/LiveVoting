# 🚀 Quick Start Guide

## Super Fast Setup (5 minutes)

### 1. Install
```bash
cd CreatorsTank
npm install
```

### 2. Set Up Convex (100% Free, No Credit Card!)
```bash
npx convex dev
```
- Opens browser to sign up with GitHub/Google
- Creates your project automatically
- No config needed!

### 3. Start the App
Open a **new terminal** and run:
```bash
npm run dev
```

### 4. Initialize Teams
- Open http://localhost:3000/imsetup
- Add team names → Click "Initialize"

### 5. Test It!
- **Audience view:** http://localhost:3000
- **Admin panel:** http://localhost:3000/imadminpage

## 🌐 Deploy to Production

### Step 1: Deploy Convex
```bash
npx convex deploy
```
Copy the production URL it gives you.

### Step 2: Deploy to Vercel
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# Then:
# 1. Go to vercel.com
# 2. Import your GitHub repo
# 3. Add environment variable: NEXT_PUBLIC_CONVEX_URL = (production URL from step 1)
# 4. Deploy!
```

## 📱 On Event Day

1. Share audience URL: `your-app.vercel.app`
2. Keep admin panel open: `your-app.vercel.app/imadminpage`
3. Click "Next Team" → **All 300 phones update instantly!** 🔥
4. Watch the likes roll in real-time! 🎉

## 💰 Cost

**$0.00** - Convex free tier handles everything! No credit card needed!

## 🎯 Pro Tips

- **Test first:** Open the app on 2-3 phones to see real-time sync
- **QR Code:** Generate a QR code for the audience URL
- **Backup:** Keep the admin URL private
- **Projector:** Show the audience view on the big screen for hype!

That's it! You're ready to rock! 🎸
