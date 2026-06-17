# 🧪 AI Assistant - Test Scenarios (Updated Rules)

## ✅ **ESCALATION RULE: Only 3 Cases**

The AI will show the red "🚨 ESCALARE URGENTĂ" banner ONLY for:

1. **Angry/Aggressive Customer** - Threatens ANPC, 1-star reviews, or blames ZSmart
2. **Explicit Human Request** - "Vreau să vorbesc cu un om", "Sunați-mă"
3. **Active Highway Emergency** - "Sunt pe autostradă, mașina arde, ce fac?"

---

## 🚫 **NO ESCALATION** - AI Handles Fully Automatically

### Test Case 1: Check Engine Light (MEDIUM urgency)
**Input:**
```
Martorul Check Engine s-a aprins pe bord. Ce ar putea fi?
```

**Expected Response:**
- ✅ Normal diagnosis (NO red banner)
- ✅ Shows urgency level: MEDIE/RIDICATĂ
- ✅ Recommends "Diagnosticare Motor (420 Lei)"
- ✅ Shows "Adaugă în coș" button
- ❌ NO escalation to human

---

### Test Case 2: Overheating Engine (CRITICAL urgency)
**Input:**
```
Motorul face fum alb și temperatura e la roșu! Ce fac?
```

**Expected Response:**
- ✅ Critical warning: "🚨 OPREȘTE IMEDIAT!"
- ✅ Gives instructions: "Stop engine, don't open radiator cap"
- ✅ Recommends "Diagnosticare Motor (420 Lei)" after cooldown
- ✅ Shows service button
- ❌ NO red escalation banner (AI handles emergency guidance)

---

### Test Case 3: Accident Happened
**Input:**
```
Am avut un accident și acum mașina nu pornește deloc. Aveți service aici?
```

**Expected Response:**
- ✅ Sympathetic response
- ✅ Recommends "Diagnosticare Motor (420 Lei)"
- ✅ Explains ZSmart can help
- ❌ NO escalation (this is a technical question, not a complaint)

---

### Test Case 4: Brake Noise (HIGH urgency)
**Input:**
```
Când frânez, mașina face un zgomot ciudat și vibrează.
```

**Expected Response:**
- ✅ Diagnosis: worn brake pads/warped rotors
- ✅ Urgency: CRITICĂ or RIDICATĂ
- ✅ Recommends "Revizie Sistem Frânare (700 Lei)"
- ✅ Shows service button
- ❌ NO escalation

---

## 🔴 **YES ESCALATION** - Red Banner + Human Handoff

### Test Case 5: Angry Customer (Blames ZSmart)
**Input:**
```
Băieți, am fost la voi acum o lună și mi-ați schimbat uleiul, iar acum 
motorul scoate un sunet groaznic! Cred că mi-ați stricat mașina! Vreau ca 
Zaharia Teodor să mă sune PE MOBIL în următoarele 5 minute, altfel vă las 
recenzie de 1 stea peste tot și vă reclam la ANPC
```

**Expected Response:**
- ✅ Red "🚨 ESCALARE URGENTĂ" banner
- ✅ "Înțeleg frustrarea ta..."
- ✅ Asks for: name, phone, car details
- ✅ Mentions warranty and inspection
- ❌ NO prices shown
- ❌ NO service buttons
- ❌ NO admission of fault

**Why:** Contains anger ("mi-ați stricat"), threats (ANPC, 1 stea), human request ("să mă sune")

---

### Test Case 6: Explicit Human Request
**Input:**
```
Nu vreau să vorbesc cu un robot. Vreau să vorbesc cu Teodor sau cu cineva real.
```

**Expected Response:**
- ✅ Red escalation banner
- ✅ "Sunt un asistent automatizat..."
- ✅ Asks for contact details
- ❌ NO normal diagnosis

**Why:** Explicit request: "vreau să vorbesc cu cineva real"

---

### Test Case 7: Highway Emergency + Help Request
**Input:**
```
Sunt pe autostradă A1, mașina scoate fum și miroase urât. Ce fac? Ajutor!
```

**Expected Response:**
- ✅ Red escalation banner (active emergency + cry for help)
- ✅ Immediate safety instructions
- ✅ Asks for contact details to escalate
- ✅ Priority handoff to Teodor

**Why:** Highway + smoke + explicit "ajutor" = active danger

---

### Test Case 8: ANPC Threat
**Input:**
```
Serviciul vostru de AC nu a rezolvat nimic! Și ați luat 610 Lei degeaba! 
Dacă nu îmi returnați banii, sun la ANPC!
```

**Expected Response:**
- ✅ Red escalation banner
- ✅ "Înțeleg situația..."
- ✅ NO admission of fault
- ✅ Mentions warranty
- ✅ Asks for contact details
- ❌ NO new service recommendations

**Why:** Complaint about past service + ANPC threat = escalation

---

## 🎯 **Key Differences Summary**

| Scenario | AI Behavior | Escalation? |
|----------|-------------|-------------|
| Check Engine light | Diagnose + recommend service | ❌ NO |
| Critical overheating | Safety instructions + service | ❌ NO |
| Brake problems | Diagnose + recommend brakes | ❌ NO |
| Accident happened | Explain services available | ❌ NO |
| "Call me please" | Normal response + phone info | ❌ NO (unless angry) |
| **Angry + blames ZSmart** | **Red banner + handoff** | **✅ YES** |
| **"I want a human"** | **Red banner + handoff** | **✅ YES** |
| **Highway fire + help** | **Red banner + handoff** | **✅ YES** |
| **ANPC threat** | **Red banner + handoff** | **✅ YES** |

---

## 💡 **Why This Matters**

### **Before (Too Sensitive):**
- Customer: "Check Engine is on, help!"
- AI: 🚨 ESCALARE URGENTĂ → Teodor gets notified
- **Problem:** Teodor gets 50 alerts/day for simple questions

### **After (Refined):**
- Customer: "Check Engine is on, help!"
- AI: "⚠️ Urgență MEDIE. Recomand Diagnosticare Motor (420 Lei). Programează?"
- **Result:** AI handles 90% of questions autonomously

---

## 🔧 **How to Test**

1. **Run dev server:**
   ```bash
   npm run dev
   ```

2. **Open AI assistant** (bottom-right "AI Asistent" button)

3. **Test each scenario above** and verify:
   - Normal questions → NO red banner
   - Angry/human requests → RED banner

---

**Last Updated:** June 17, 2026  
**Status:** ✅ Ready for testing
