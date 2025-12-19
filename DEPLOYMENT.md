# 🚀 Deployment Guide - QuantumVeda

## Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Your custom domain (if you want to use one)

---

## Part 1: Deploy to Vercel

### Step 1: Push Your Code to GitHub

1. **Initialize Git (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - QuantumVeda ready for deployment"
   ```

2. **Create a new repository on GitHub**
   - Go to [github.com/new](https://github.com/new)
   - Name it: `QuantumVeda` (or your preferred name)
   - Don't initialize with README (we already have code)
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/QuantumVeda.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Log In"
   - Choose "Continue with GitHub"

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Find your `QuantumVeda` repository
   - Click "Import"

3. **Configure Project Settings**
   
   **Framework Preset:** Vite
   
   **Root Directory:** `./` (leave as is)
   
   **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   
   **Environment Variables:** (None needed for this project)

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for the build to complete
   - You'll get a URL like: `quantumveda.vercel.app`

---

## Part 2: Add Your Custom Domain

### Option A: Domain from Vercel

1. **Buy Domain on Vercel**
   - Go to your project dashboard
   - Click "Settings" → "Domains"
   - Click "Buy a domain"
   - Search for your desired domain
   - Complete purchase

2. **Domain Auto-Configuration**
   - Vercel automatically configures DNS
   - Your site will be live on your domain in ~5 minutes

### Option B: Use Your Own Domain (GoDaddy, Namecheap, etc.)

#### Step 1: Add Domain to Vercel

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Enter your domain (e.g., `quantumveda.com`)
4. Click **"Add"**

#### Step 2: Configure DNS Records

Vercel will show you the DNS records you need to add. You have two options:

**Option 1: Using A Records (Recommended)**

Add these A records in your domain registrar's DNS settings:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**Option 2: Using CNAME (Alternative)**

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | cname.vercel-dns.com |
| CNAME | www | cname.vercel-dns.com |

#### Step 3: Add DNS Records in Your Domain Registrar

**For GoDaddy:**
1. Log in to GoDaddy
2. Go to "My Products" → "Domains"
3. Click on your domain → "DNS"
4. Click "Add" to add new records
5. Add the A and CNAME records from above
6. Save changes

**For Namecheap:**
1. Log in to Namecheap
2. Go to "Domain List" → Click "Manage" on your domain
3. Go to "Advanced DNS" tab
4. Click "Add New Record"
5. Add the A and CNAME records from above
6. Save changes

**For Cloudflare:**
1. Log in to Cloudflare
2. Select your domain
3. Go to "DNS" section
4. Click "Add record"
5. Add the A and CNAME records from above
6. Make sure the proxy status (orange cloud) is OFF for Vercel
7. Save changes

#### Step 4: Verify Domain

1. Go back to Vercel → Settings → Domains
2. Wait for DNS propagation (can take 5 minutes to 48 hours, usually ~1 hour)
3. Vercel will automatically verify and issue SSL certificate
4. Your site will be live on your custom domain! 🎉

---

## Part 3: Post-Deployment Checklist

### ✅ Things to Verify

1. **Check All Pages Work**
   - Home page loads correctly
   - Admin login works (`/admin`)
   - All routes are accessible

2. **Test Functionality**
   - Newsletter subscription
   - Video gallery
   - Article links
   - Social media links (Discord, WhatsApp, Twitter)

3. **Performance Check**
   - Run [PageSpeed Insights](https://pagespeed.web.dev/)
   - Should score 90+ on all metrics

4. **SSL Certificate**
   - Your site should automatically have HTTPS
   - Check for the padlock icon in browser

### 🔧 Common Issues & Fixes

**Issue: 404 on page refresh**
- **Fix:** Vercel handles this automatically for Vite/React Router
- If issues persist, add `vercel.json`:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

**Issue: Domain not connecting**
- **Fix:** Wait longer (DNS can take up to 48 hours)
- Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net/)
- Ensure DNS records are correct (no typos)

**Issue: Build fails**
- **Fix:** Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

---

## Part 4: Continuous Deployment

### Automatic Deployments

Every time you push to GitHub, Vercel automatically:
1. Detects the push
2. Builds your project
3. Deploys the new version
4. Updates your live site

### How to Update Your Site

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys! 🚀
```

### Preview Deployments

- Every branch and PR gets a unique preview URL
- Test changes before merging to main
- Share preview links with team/clients

---

## Part 5: Custom Domain Best Practices

### Recommended Setup

1. **Main Domain:** `quantumveda.com` → Your site
2. **WWW Subdomain:** `www.quantumveda.com` → Redirects to main
3. **SSL:** Automatically handled by Vercel (free)

### Domain Propagation Timeline

- **Immediate:** Vercel shows domain added
- **5-30 minutes:** DNS starts propagating
- **1-2 hours:** Most users can access
- **24-48 hours:** Fully propagated worldwide

### Check Propagation Status

Visit: `https://www.whatsmydns.net/`
- Enter your domain
- Select "A" record type
- Check if it shows Vercel's IP: `76.76.21.21`

---

## Part 6: Environment Variables (If Needed Later)

If you add backend features, you can add environment variables:

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Environment Variables"
3. Add variables (e.g., `VITE_API_KEY`)
4. Redeploy for changes to take effect

**Note:** Vite requires variables to start with `VITE_`

---

## 🎯 Quick Reference

### Vercel Dashboard URLs
- **Project Dashboard:** `vercel.com/your-username/quantumveda`
- **Deployments:** `vercel.com/your-username/quantumveda/deployments`
- **Domain Settings:** `vercel.com/your-username/quantumveda/settings/domains`

### DNS Record Quick Copy

**A Record:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`
- TTL: `3600` (or Auto)

**CNAME Record:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: `3600` (or Auto)

---

## 🆘 Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **DNS Help:** Check your domain registrar's documentation

---

## 🎉 You're Done!

Your QuantumVeda site is now live and accessible worldwide!

**Next Steps:**
- Share your site URL
- Monitor analytics in Vercel dashboard
- Keep building awesome features! 🚀
