# 🛡️ AI Assistant - Complaint Handling & Liability Protection

## 🎯 **CRITICAL RULE: 90% Autonomy**

The AI handles **90% of conversations fully automatically**, including:
- Technical diagnostics (check engine, overheating, brake problems)
- Emergency guidance (stop the car, safety instructions)
- Service recommendations and pricing
- Appointment booking questions

**Escalation to human ONLY happens in 3 cases:**
1. Customer is angry/aggressive (threatens ANPC, 1-star reviews, blames ZSmart)
2. Customer explicitly requests human contact ("Vreau să vorbesc cu un om", "Sunați-mă")
3. Active highway emergency + explicit cry for help ("Sunt pe autostradă, arde, AJUTOR!")

## ✅ What Was Fixed

### 1. **Liability Protection** 
**Problem:** AI was admitting fault ("possible error in oil quality" / "mistake in replacement process")

**Solution:** System prompt now EXPLICITLY forbids:
- Admitting any mistakes or errors
- Speculating about bad parts/oil quality  
- Suggesting the shop did anything wrong

**New behavior:** AI says "Teodor needs to inspect the vehicle personally to determine the exact cause"

---

### 2. **Stop Selling to Angry Customers**
**Problem:** AI was trying to charge 420 Lei for diagnostics when customer believed the shop broke their car under warranty

**Solution:** Complaint detection system that:
- Detects keywords: "furios", "ați stricat", "ANPC", "recenzie", "după serviciu", etc.
- Automatically switches to "escalation mode"
- STOPS showing prices and service buttons
- Shows red "🚨 ESCALARE URGENTĂ" banner

**New behavior:** No upselling when customer is angry or mentions recent service issues

---

### 3. **Acknowledge Urgent Demands**
**Problem:** AI ignored threats ("I'll leave 1 star review") and urgent requests ("Call me in 5 minutes")

**Solution:** System prompt now includes specific responses for:
- Review threats → "I'm marking this as MAXIMUM PRIORITY for Teodor"
- Phone call demands → "I'm an AI and can't make calls, but I'm flagging this as URGENT"
- ANPC mentions → "All ZSmart services have warranty. Teodor will inspect personally."

**New behavior:** AI validates the customer's urgency and explains its limitations clearly

---

### 4. **Warranty & Recent Service Detection**
**Problem:** AI treated warranty claims like new diagnostic sales

**Solution:** When customer mentions:
- "tocmai am fost" (just came)
- "ieri" (yesterday)  
- "după ce ați..." (after you...)
- "garantie" (warranty)

**AI Response Template:**
```
🔴 Înțeleg total frustrarea ta și vreau să rezolvăm asta urgent.

Sunt un asistent automatizat, deci nu pot face apeluri sau verifica 
direct ce s-a întâmplat cu mașina ta.

Ceea ce fac IMEDIAT este să transmit situația ta ca PRIORITATE MAXIMĂ 
către Teodor.

Pentru ca el să te contacteze rapid, am nevoie de:
• Numele tău complet
• Numărul de telefon  
• Numărul mașinii

Toate serviciile ZSmart au garanție, iar Teodor trebuie să inspecteze 
personal vehiculul pentru a vedea exact ce s-a întâmplat.
```

---

## 🔍 How Complaint Detection Works (REFINED - Very Selective)

### Automatic Triggers (ONLY 3 Categories):

**1. Anger/Blame:**
- furios, nervos, supărat, dezamăgit
- "ați stricat", "mi-ați distrus", "din vina voastră"

**2. Legal/Review Threats:**
- ANPC, recenzie proastă, 1 stea, plângere, avocat

**3. Explicit Human Contact:**
- "vreau să vorbesc cu un om/cineva"
- "sunați-mă", "să mă sune Teodor"

**4. Active Highway Emergency:**
- (autostradă OR drum) + (fum OR arde) + (ajutor OR urgență)

### What DOES NOT Trigger Escalation:

❌ Check Engine lights (handled automatically)  
❌ Overheating/critical issues (AI gives safety instructions)  
❌ Accidents (AI recommends diagnostics)  
❌ General urgency (AI diagnoses and recommends services)  
❌ Warranty questions about hypothetical issues  
❌ "When can I book?" or "How much?" questions

### When Detected:

1. Red "🚨 ESCALARE URGENTĂ" banner appears
2. No service prices shown
3. No "Adaugă în coș" buttons
4. Response focuses on de-escalation and human handoff

---

## 🧪 Test Cases You Should Try

### ✅ Test 1: Angry Customer (Should ESCALATE)
**Input:**  
"Am fost ieri la voi pentru schimb ulei și acum motorul face zgomot ciudat! Înainte mergea perfect. Ați stricat ceva la mașina mea! Vreau să mă sune Teodor în 5 minute sau las recenzie cu 1 stea!"

**Expected AI Response:**
- ✅ Shows red urgent banner
- ✅ Does NOT mention 420 Lei diagnostic
- ✅ Does NOT admit fault
- ✅ Asks for contact details
- ✅ Explains it's an AI and can't call
- ✅ Mentions warranty and inspection

---

### ✅ Test 2: ANPC Threat (Should ESCALATE)
**Input:**  
"Chiar ați folosit ulei sintetic? Pentru că acum consumă mult mai mult. Dacă nu rezolvați gratuit, sun la ANPC!"

**Expected AI Response:**
- ✅ Red urgent banner
- ✅ No prices
- ✅ Does NOT speculate about oil quality
- ✅ Says "Teodor needs to inspect"
- ✅ Mentions ZSmart warranty
- ✅ Asks for contact details

---

### ✅ Test 3: Check Engine Light (Should NOT Escalate)
**Input:**  
"S-a aprins martorul Check Engine pe bord. Ce ar putea fi?"

**Expected AI Response:**
- ✅ Normal blue/cyan response (NO red banner)
- ✅ Shows diagnosis and urgency level
- ✅ Mentions "Diagnosticare Motor (420 Lei)"
- ✅ Shows "Adaugă în coș" button
- ✅ Normal friendly tone

---

### ✅ Test 4: Critical Overheating (Should NOT Escalate)
**Input:**  
"Motorul scoate fum alb și temperatura e la maxim! Ce fac urgent?"

**Expected AI Response:**
- ✅ Normal response (NO red banner)
- ✅ Critical safety instructions: "🚨 OPREȘTE IMEDIAT!"
- ✅ Guidance: "Don't open radiator cap, let cool 30+ min"
- ✅ Recommends "Diagnosticare Motor (420 Lei)" after cooldown
- ✅ Shows service button

---

### ✅ Test 5: Explicit Human Request (Should ESCALATE)
**Input:**  
"Nu vreau să vorbesc cu un robot. Vreau să vorbesc cu Teodor sau cineva real."

**Expected AI Response:**
- ✅ Red escalation banner
- ✅ "Sunt un asistent automatizat..."
- ✅ Asks for contact details
- ✅ No normal diagnosis/pricing

---

## 📋 What Teodor Should Do

When the AI escalates a complaint:

1. **Respond within 1 hour** if possible (customer expectations are set)
2. **Don't reference AI responses** - treat it as a fresh conversation
3. **Inspect vehicle personally** before offering solutions
4. **Document everything** - photos, notes, before/after
5. **Check service history** - was there actually a recent service?

---

## 🚀 Deployment Checklist

Before pushing to production:

- [ ] Test all 3 test cases above
- [ ] Verify red banner shows for angry customers
- [ ] Verify service buttons DON'T show during complaints
- [ ] Test with Web3Forms key to ensure contact form works
- [ ] Push to GitHub: `git push -u origin main`
- [ ] Deploy to Vercel with environment variables
- [ ] Test live site with Romanian complaint keywords

---

## 🔧 Files Modified

- `src/modules/aiAssistant.js` - Updated system prompt + complaint detection
  - New `detectComplaint()` function
  - Enhanced `appendBotMsg()` with escalation banner
  - Modified `handleSend()` to disable sales during complaints

---

## 📞 Emergency Override

If the AI is still misbehaving in production, you can add this to `.env`:

```
VITE_AI_SAFE_MODE=true
```

(Note: This would need to be implemented if issues persist - currently not in code)

---

**Last Updated:** June 17, 2026  
**Build Status:** ✅ Successful (`npm run build` passed)  
**Ready for Production:** ✅ Yes (after Web3Forms key added)
