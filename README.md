# 🎬 Creators Tank - Real-time Voting App

A beautiful, real-time voting application for college events where students can vote for their favorite creator reels. Built with Next.js, **Convex**, and Framer Motion.

## ✨ Features

- 🎨 **Beautiful Dark Theme** with gradient animations  
- ⚡ **Real-time Updates** - When admin clicks "Next Team", all 300 phones update INSTANTLY!
- 💜 **Smooth Animations** with Framer Motion particle effects
- 📱 **Mobile-first Design** perfect for 200-300 concurrent users
- 👑 **Admin Panel** to control the event flow
- 🔥 **No Backend Code** - fully serverless with Convex
- 💰 **100% FREE** - Convex free tier is perfect for this!

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (React, TypeScript)
- **Database:** Convex (real-time, serverless)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Hosting:** Vercel (frontend) + Convex (backend)
- **Icons:** Lucide React

## 📦 Super Quick Setup (5 minutes!)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex (No Credit Card Required!)

```bash
npx convex dev
```

This will:
- Open your browser to sign up/login (GitHub/Google)
- Create a new Convex project
- Generate your `.env.local` with `NEXT_PUBLIC_CONVEX_URL`
- Start the Convex dev server

**That's it!** No complicated config, no credit card needed! 🎉

### 3. Start the App

Open a new terminal and run:

```bash
npm run dev
```

### 4. Initialize Teams

1. Go to http://localhost:3000/imsetup
2. Add all your team names
3. Click "Initialize Database"
4. Done!

## 🎮 How to Use

### Audience View (Main Page)
- URL: `https://your-app.vercel.app/`
- Shows the current team
- Students tap the "Like" button to vote
- Real-time like counter updates instantly for everyone
- Beautiful animations and particle effects

### Admin Panel
- URL: `https://your-app.vercel.app/imadminpage`
- **Keep this URL private!** (only share with organizers)
- View all teams and their like counts in real-time
- Click "Next Team" to switch to the next team (updates all 300 phones instantly! 🔥)
- Click any team card to jump to that team
- Reset all likes if needed

## 🌐 Deployment to Vercel

### 1. Deploy Convex to Production

```bash
npx convex deploy
```

This creates a production Convex deployment and gives you a production URL.

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/creators-tank.git
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Add Environment Variable:
   - `NEXT_PUBLIC_CONVEX_URL` = your production Convex URL (from step 1)
5. Click "Deploy"

### 4. After Deployment

1. You'll get a URL like `https://creators-tank.vercel.app`
2. Go to `https://creators-tank.vercel.app/imsetup` to initialize teams
3. Share `https://creators-tank.vercel.app/` with students (audience view)
4. Use `https://creators-tank.vercel.app/imadminpage` for event control

## 📱 Event Day Instructions

### Before the Event
1. Test the admin panel: Make sure you can switch teams
2. Test on multiple devices: Open the audience view on 2-3 phones
3. Check real-time sync: Switch teams in admin and verify it updates on all devices
4. Share the audience URL with students (WhatsApp, QR code, etc.)

### During the Event
1. Keep the admin panel open on your laptop
2. When a reel starts playing, click "Next Team" or select the team
3. **All 300 phones update INSTANTLY** 🔥
4. Students will see the team name and can start liking
5. Watch the likes roll in real-time!

### After Each Segment
- You can reset likes if you want to start fresh for different rounds
- Or keep cumulative likes for the full event

## 💰 Why Convex is Perfect (100% Free!)

### Convex Free Tier:
- ✅ **1 million function calls/month** (way more than you need!)
- ✅ **1 GB database storage**
- ✅ **Real-time subscriptions included**
- ✅ **No credit card required**
- ✅ **No surprise bills**

### Your Event Usage:
For a 2-hour event with 300 students:
- Initial loads: ~3,000 calls
- Team switches: ~15,000 calls
- Like updates: ~15,000 calls
- **Total: ~33,000 calls** ✅ Way under 1 million!

**You won't pay a single rupee!** 🎉

## 🎯 How Real-time Works

When you click "Next Team" in admin:
1. Convex instantly updates the database
2. **All 300 phones get the update in <100ms**
3. Team name smoothly transitions with animations
4. Like button resets for new team
5. Students can immediately start voting

**No polling, no delays, just pure real-time magic!** ✨

## 🎨 Customization

### Change Colors
Edit [tailwind.config.ts](tailwind.config.ts):
```typescript
colors: {
  neon: {
    purple: '#a855f7', // Change these!
    pink: '#ec4899',
    blue: '#3b82f6',
  }
}
```

### Add More Teams Later
Just go to `/setup` page again to reinitialize.

## 🐛 Troubleshooting

**"Convex URL not found" error:**
- Make sure you ran `npx convex dev`
- Check if `.env.local` exists with `NEXT_PUBLIC_CONVEX_URL`
- Restart the dev server: `npm run dev`

**Votes not updating in real-time:**
- Make sure the Convex dev server is running (`npx convex dev`)
- Check browser console for errors
- Verify you're on the same network

**Admin panel doesn't switch teams:**
- Check browser console for errors
- Make sure Convex is running
- Try refreshing the page

## 🎉 Have a Great Event!

Your event will be 🔥 and completely FREE! The real-time updates will blow everyone's mind when all 300 phones switch teams instantly! 🚀

---

**Made with 💜 for college events • Powered by Convex**
