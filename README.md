# Engineering Tracks - Image-First Presentation Timer Studio

A full-screen, high-definition digital signage & presentation web application designed for lecturers and facilitators. Built with an **Image-First (75% Hero / 25% Gallery)** layout, where the presentation slides are the hero visual element and the timer is a small, elegant corner overlay.

---

## 🌟 Screen Proportions: 75% Hero / 25% Gallery

The application strictly divides the presentation viewport into:
- **75% Dominant Hero Area:** Displays the fixed, high-resolution featured slide with `object-fit: cover` (or contain). It never automatically rotates or changes on its own.
- **25% Secondary Scrolling Gallery:** Automatically scrolls through the remaining slides. Clicking any thumbnail in the gallery instantly promotes it to the 75% hero slide with a smooth fade transition.

---

## 🖼️ Two Gallery Layout Options

Presenters can switch between layouts with one click in the top bar, dashboard, or floating presentation HUD:

### Option A: Vertical Gallery (Right Side)
- **75% Width:** Main featured image on the left.
- **25% Width:** Vertical secondary gallery on the right.
- Images continuously move from **bottom to top** in a seamless, infinite loop.
- **Directly synchronized with the countdown timer.**

### Option B: Horizontal Gallery (Bottom)
- **75% Height:** Main featured image on top.
- **25% Height:** Horizontal secondary gallery along the bottom.
- Images continuously move from **right to left** in a seamless, infinite loop.
- **Directly synchronized with the countdown timer.**

---

## ⚡ Timer Synchronization State Matrix

| Timer State | Gallery Behavior |
|---|---|
| **Not Started** | Static (at initial position, paused) |
| **Running** | Continuous, smooth movement |
| **Paused** | Immediately freezes at current exact position |
| **Resumed** | Continues from the exact same subpixel position |
| **Reset** | Returns to initial position (0) and stops |
| **Completed** | Stops moving |

---

## ⚙️ Gallery Animation Controls
- **Movement Speed Presets:** Slow (45s), Normal (25s), Fast (12s), Custom.
- **Custom Duration Slider:** 5s to 60s per loop.
- **Image Spacing:** Compact (8px), Normal (14px), Relaxed (20px).
- **Image Scale:** Compact, Normal, Large.
- **Auto-scroll Toggle:** Turn continuous movement on or off.

---

## ⏱️ Small, Elegant Corner Timer Overlay

The countdown timer is a small glassmorphism overlay badge resting in a corner of the main slide:
- **Position Options:** Top-Right (default), Top-Left, Bottom-Right, Bottom-Left.
- **Size Options:** Compact, Normal, Large.
- **Glass Transparency:** Dark Glass, Frosted Glass, Solid Carbon, Minimalist Ghost.
- **Color Accent:** Engineering Tracks Orange, Clean White, Warm Amber, Emerald Green, Tech Cyan.
- **Show/Hide:** Toggle on or off whenever needed.
- **Drift-Free Precision:** Accurately maintains time across background tab switching and sleep mode.
- **Synthesized Audio Alert:** Zero-dependency multi-tone chimes generated via the Web Audio API.

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Production build & preview
npm run build
npm run preview
```

Open your browser at `http://localhost:3000`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| --- | --- |
| `Space` | Start / Pause / Resume Countdown |
| `F` | Toggle Fullscreen 16:9 Presentation Mode |
| `R` | Reset Timer |
| `Esc` | Exit Fullscreen / Close Drawers |
