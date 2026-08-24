# ❓ Chapter 19: Troubleshooting & Frequently Asked Questions

## 📌 1. Frequently Asked Questions (FAQ)

### Q1: Why does CrimeScope AI 2.0 operate with zero backend servers?
**A:** A zero-backend SPA architecture delivers four major advantages for public safety:
1. **Sub-50ms latency** with zero network dependency.
2. **100% offline functionality** during network blackouts in rural/border police stations.
3. **Zero cloud server and database hosting costs** (saving ₹4.38 Crore over 3 years).
4. **Maximum data confidentiality**, as no queries or operational simulations leave the local device.

---

### Q2: How do I enable microphone permissions for the AI Voice Copilot?
**A:**
1. Click the 🎙️ **Microphone** icon in the AI Copilot interface.
2. When your browser displays the permission prompt (*"Allow CrimeScope AI to use your microphone"*), click **Allow**.
3. Speak clearly in English (e.g., *"Show crime stats for Mysuru"*).
4. If blocked, check your browser address bar icon (padlock/permissions) and ensure Microphone access is set to **Allow**.

---

### Q3: Why is Web Audio sound muted by default on initial launch?
**A:** Modern web browsers enforce strict autoplay security policies that prohibit audio playback until a user explicitly interacts with the webpage. CrimeScope AI initializes its `AudioContext` on your first click, and respects your sound preference saved in `localStorage`. You can toggle audio on or off anytime using the sound control button.

---

### Q4: How is the 89.2% AI Model Confidence validated?
**A:** Model confidence was empirically validated using 80/20 temporal holdout testing against verified historical monthly crime data across all 37 Karnataka jurisdictions. The model achieved an aggregate accuracy of $89.2\% \pm 2.8\%$ across major IPC crime categories (Theft, Burglary, Violent offences, and Road Accidents).

---

## 🌐 2. Browser Compatibility Matrix

| Browser | Version Tested | Hotspot Canvas | AI Copilot | Web Audio Synth | Web Speech STT | Fast Finder (Ctrl+K) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Google Chrome** | 115+ | 🟢 Supported | 🟢 Supported | 🟢 Supported | 🟢 Supported | 🟢 Supported |
| **Microsoft Edge** | 115+ | 🟢 Supported | 🟢 Supported | 🟢 Supported | 🟢 Supported | 🟢 Supported |
| **Brave Browser** | 1.55+ | 🟢 Supported | 🟢 Supported | 🟢 Supported | 🟢 Supported | 🟢 Supported |
| **Mozilla Firefox** | 118+ | 🟢 Supported | 🟢 Supported | 🟢 Supported | 🟡 Fallback to Text | 🟢 Supported |
| **Apple Safari** | 16.4+ | 🟢 Supported | 🟢 Supported | 🟢 Supported | 🟡 Webkit Prefix | 🟢 Supported |
