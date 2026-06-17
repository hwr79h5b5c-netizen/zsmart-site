# ZSMART Distribution ZTG SRL — Website

Immersive 3D automotive services site built with Three.js, GSAP, and Vite.

## Features

- 🎨 Futuristic 3D floating service modules (engine, brakes, transmission, etc.)
- 🤖 AI-powered diagnostic assistant (Cohere API)
- 📱 Fully mobile responsive
- 🛒 Interactive "Service Bay" shopping cart with 3D preview
- ✉️ Working contact form (Web3Forms)
- ⚡ Lightning-fast (Vite + optimized Three.js)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
   
   Then add your API keys:
   
   - **Cohere AI keys** (already included in `.env`):
     - `VITE_COHERE_KEY_1`
     - `VITE_COHERE_KEY_2`
   
   - **Web3Forms key** (for contact form):
     1. Go to [web3forms.com](https://web3forms.com)
     2. Enter your email
     3. Copy the access key
     4. Add to `.env`: `VITE_WEB3FORMS_KEY=your_access_key`

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Build for production:**
   ```bash
   npm run build
   ```

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_COHERE_KEY_1`
   - `VITE_COHERE_KEY_2`
   - `VITE_WEB3FORMS_KEY`
4. Deploy

## Tech Stack

- **Framework:** Vite
- **3D:** Three.js
- **Animations:** GSAP + ScrollTrigger
- **AI:** Cohere API
- **Forms:** Web3Forms
- **Styling:** Pure CSS (no frameworks)

## Company Info

**ZSMART DISTRIBUTION ZTG SRL**  
CUI: 35646960  
Str. Anotimpurilor, Nr. 11  
Săcele, jud. Brașov  
România

Administrator: Zaharia Teodor George

---

Built with precision engineering. 🔧
