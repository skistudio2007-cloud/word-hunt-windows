# 🏬 Word Hunt - Microsoft Store Publishing Guide

Yeh guide aapko **Word Hunt - Windows Edition** ko **Microsoft Store (Windows 10 / Windows 11 Store)** par publish karne ke aasaan steps batata hai.

---

## 📋 Pre-Requisites (Zaroori Cheezein)

1. **Microsoft Developer Account**:
   - Website: [partner.microsoft.com/dashboard](https://partner.microsoft.com/dashboard)
   - Ek baar ka standard registration fee hota hai (lagbhag \$19 USD individual account ke liye, jo direct Microsoft ko diya jata hai).
2. **App Icons & Manifest**:
   - Aapke project me sabhi required icons (`public/icons/`), `manifest.json`, aur `sw.js` (offline mode) already generate aur verify kar diye gaye hain.

---

## 🚀 Method 1: PWABuilder (Official Microsoft-Recommended Tool - Sabse Aasaan)

Microsoft ne PWAs ko Microsoft Store par launch karne ke liye **PWABuilder** banaya hai jo **1-click** me Windows `.msix` package generate karta hai:

### Step 1: Website Host Karein ya Local Link Use Karein
- Aap apne `dist` folder ko kisi bhi free hosting par deploy kar sakte hain (jaise **Vercel**, **Netlify**, **GitHub Pages**, ya **Cloudflare Pages** - sabhi 100% free hain).
- Example URL: `https://your-word-hunt.vercel.app`

### Step 2: PWABuilder Open Karein
1. Browser me **[https://www.pwabuilder.com](https://www.pwabuilder.com)** kholein.
2. Apne deployed game ka URL enter karein aur **"Start"** dabayein.
3. PWABuilder aapke `manifest.json` aur icons ko test karega (Score 100% Store Ready aayega).

### Step 3: Windows Package Download Karein
1. **"Package for Stores"** par click karein.
2. **"Windows"** option select karein aur **"Generate Package"** par click karein.
3. Apna Developer Name aur Package ID enter karein:
   - **Package ID**: `WordHunt.Windows`
   - **Publisher Display Name**: Aapka naam ya Brand Name
   - **Publisher ID**: Microsoft Partner Center se copy karein (jaise `CN=XXXX-XXXX...`)
4. Download par click karein -> Aapko ek **`.zip`** file milegi jisme ready-to-upload **`.msix` / `.msixbundle`** package hoga!

---

## 📝 Method 2: Microsoft Partner Center par Submission

1. **Partner Center me Login Karein**:
   - [partner.microsoft.com/dashboard](https://partner.microsoft.com/dashboard) par jayein.
2. **Naya App Create Karein**:
   - **Apps & Games** -> **New Product** -> **MSIX or PWA app**.
   - App Name reserve karein: `Word Hunt` ya `Word Hunt - Windows Edition`.
3. **Product Details Bharein**:
   - **Pricing**: Free ($0.00).
   - **Age Rating**: 3+ / Everyone (Kyunki game me koi violence, ads, ya personal data tracking nahi hai).
   - **Category**: Games -> Word / Puzzle / Educational.
   - **Description**:
     ```
     Find. Learn. Explore. Word Hunt is a modern, offline word search puzzle adventure with 10,000+ levels, journey progression, and relaxing gameplay.
     ```
   - **Screenshots**: Game ki 2-3 screenshots upload karein (1920x1080 desktop format).
4. **Package Upload**:
   - PWABuilder se mila hua **`.msix`** file drag & drop karke upload karein.
5. **Privacy Policy Link**:
   - Game me built-in Privacy Policy hai; aap hosted link ya developer site ka link enter karein.
6. **Submit to the Store**:
   - **"Submit to the Store"** button par click karein.
   - Microsoft team 24 se 72 ghante ke andar certification pass karke app ko live kar degi!

---

## 🔒 Security & Privacy Declarations (Microsoft Store Reviewers Ke Liye)
- **Offline Capable**: Yes (100% offline self-contained logic).
- **In-App Purchases (IAP)**: None (100% Free).
- **Advertisements**: None (Zero ads).
- **External API Keys**: None (Zero remote calls).
- **Data Collection**: No personal information collected or transmitted.
- **Copyright**: © 2026 Word Hunt Windows. All Rights Reserved.

---

## 🛠️ Local Verification Commands
Agar aapko dobara build ya test karna ho:
```bash
# 1. Sabhi systems test karne ke liye:
pnpm run test

# 2. Production package build karne ke liye:
pnpm run build

# 3. Development server run karne ke liye:
pnpm run dev
```
