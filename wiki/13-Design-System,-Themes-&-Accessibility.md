# 🎨 Chapter 13: Design System, Themes & Accessibility

## 📌 1. The Obsidian & Pastel Design System

**CrimeScope AI 2.0** features a bespoke, military-grade tactical design system engineered for prolonged operational use in police control rooms and field environments.

```
Design System Color Palettes
┌──────────────────────────────┬──────────────────────────────┐
│  🌌 OBSIDIAN NIGHT (DARK)    │   ☀️ PASTEL DAY (LIGHT)      │
├──────────────────────────────┼──────────────────────────────┤
│ Background : #060913         │ Background : #f4f6fb         │
│ Panel BG   : #0d121f         │ Panel BG   : #ffffff         │
│ Card BG    : #111827         │ Card BG    : #ffffff         │
│ Border     : rgba(255,255..8)│ Border     : rgba(0,0,0,0.08)│
│ Primary    : #a855f7 (Purple)│ Primary    : #7c3aed (Purple)│
│ Cyan Glow  : #06b6d4         │ Blue Accent: #2563eb         │
│ Text       : #f8fafc         │ Text       : #0f172a         │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 🕶️ 2. Glassmorphism & Cybernetic HUD Tokens

The user interface uses modern CSS backdrop filters to create depth while maintaining readability:

```css
.glass-panel {
  background: rgba(13, 18, 31, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
```

---

## 🔤 3. Typography Hierarchy

* **Display & Headings**: `Space Grotesk` (Geometric sans-serif conveying tactical authority).
* **Body & User Interface**: `Inter` (Optimized for screen legibility at small sizes).
* **Data, Counts & Code**: `JetBrains Mono` (Monospaced tabular digits preventing number jitter).

---

## ♿ 4. Accessibility & WCAG 2.1 AA Compliance

* **High Contrast Ratios**: All text elements maintain contrast ratios exceeding **4.5:1** against backgrounds.
* **Full Keyboard Navigation**: Complete application controllable via <kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>, and <kbd>Ctrl+K</kbd>.
* **Semantic HTML Elements**: Proper ARIA landmarks (`<header>`, `<main>`, `<nav>`, `<article>`, `<dialog>`).
* **Motion Preferences**: Respects `prefers-reduced-motion` media queries.
