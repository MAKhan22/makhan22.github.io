# Animation Customization Guide

## 🎨 Where to Customize Animations

### 1. Background Animations

**Location**: `src/components/`

You have TWO background animation options:

#### Option A: Particle Network (Current)
**File**: `src/components/BackgroundAnimation.tsx`

**What it does**: Floating particles with connecting lines (subtle, GitHub-style)

#### Option B: Tron Grid ⚡ (NEW - Microprocessor/Circuit Theme)
**File**: `src/components/BackgroundAnimationTron.tsx` ✨

**What it does**: 
- Glowing grid/circuit board effect
- Pulsing nodes (like microprocessor lights)
- Energy flowing through connections
- Tron-inspired blue glow
- Very cyberpunk/tech aesthetic

---

### How to Switch Background Animations

**Edit**: `src/App.tsx`

**Current (Particles)**:
```tsx
import { BackgroundAnimation } from './components/BackgroundAnimation';

// In the component:
<BackgroundAnimation />
```

**To use Tron Grid**:
```tsx
import { BackgroundAnimationTron } from './components/BackgroundAnimationTron';

// In the component:
<BackgroundAnimationTron />
```

**Steps**:
1. Open `src/App.tsx`
2. Find line 6: `import { BackgroundAnimation } from './components/BackgroundAnimation';`
3. Change to: `import { BackgroundAnimationTron } from './components/BackgroundAnimationTron';`
4. Find line 13: `<BackgroundAnimation />`
5. Change to: `<BackgroundAnimationTron />`
6. Save and watch the magic! ✨

---

### Customizing Background Animations

#### For Particle Animation (`BackgroundAnimation.tsx`)

**Line 36**: Number of particles
```typescript
const particleCount = 50; // Change to 100 for more particles
```

**Line 56**: Particle color (light mode)
```typescript
return 'rgba(59, 130, 246, 0.08)'; // Change RGB values for different color
```

**Line 61**: Particle color (dark mode)
```typescript
return isDark ? 'rgba(96, 165, 250, 0.1)' : '...';
```

**Line 71**: Particle speed
```typescript
vx: (Math.random() - 0.5) * 0.3, // Increase 0.3 to 0.5 for faster
vy: (Math.random() - 0.5) * 0.3,
```

**Line 105**: Connection distance
```typescript
if (distance < 150) { // Increase for more connections
```

#### For Tron Grid Animation (`BackgroundAnimationTron.tsx`)

**Line 36**: Grid density
```typescript
const cols = Math.floor(canvas.width / 100); // Change 100 to 80 for denser grid
const rows = Math.floor(canvas.height / 100);
```

**Line 72**: Grid colors
```typescript
if (isDark) {
  return {
    line: 'rgba(59, 130, 246, 0.15)',    // Grid lines
    node: 'rgba(96, 165, 250, 0.3)',     // Node color
    pulse: 'rgba(96, 165, 250, 0.6)',    // Pulse effect
    glow: 'rgba(59, 130, 246, 0.8)',     // Glow color
  };
}
```

**Try these color themes**:

**Cyan/Tron Classic**:
```typescript
line: 'rgba(0, 255, 255, 0.15)',
node: 'rgba(0, 255, 255, 0.3)',
pulse: 'rgba(0, 255, 255, 0.6)',
glow: 'rgba(0, 255, 255, 0.8)',
```

**Purple/Neon**:
```typescript
line: 'rgba(147, 51, 234, 0.15)',
node: 'rgba(168, 85, 247, 0.3)',
pulse: 'rgba(168, 85, 247, 0.6)',
glow: 'rgba(147, 51, 234, 0.8)',
```

**Green/Matrix**:
```typescript
line: 'rgba(34, 197, 94, 0.15)',
node: 'rgba(74, 222, 128, 0.3)',
pulse: 'rgba(74, 222, 128, 0.6)',
glow: 'rgba(34, 197, 94, 0.8)',
```

**Line 98**: Pulse speed
```typescript
timeRef.current += 0.02; // Increase to 0.04 for faster pulse
```

**Line 176**: Opacity
```typescript
style={{ opacity: 0.7 }} // 0.5 = more subtle, 0.9 = more visible
```

---

### 2. Project Card Animations

**Location**: `src/components/ProjectCard.tsx`

#### Card Hover Effect

**Line 26-30**: Hover lift animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -5 }}  // ← Change -5 to -8 for more lift
  transition={{ duration: 0.2 }}
>
```

**Try these**:
- `y: -8` - More dramatic lift
- `y: -3` - Subtle lift
- `scale: 1.02` - Add slight scale increase
- `rotateY: 5` - Add 3D rotation

**Example - Card tilts on hover**:
```tsx
whileHover={{ y: -5, scale: 1.02, rotateY: 5 }}
transition={{ duration: 0.2, type: "spring" }}
```

#### Project Image Zoom

**Line 37-42**: Image hover effect
```tsx
<motion.img
  src={project.image}
  alt={project.title}
  className="w-full h-full object-cover"
  whileHover={{ scale: 1.05 }}  // ← Change 1.05 to 1.1 for more zoom
  transition={{ duration: 0.3 }}
/>
```

**Try these**:
- `scale: 1.1` - More zoom
- `scale: 1.03` - Subtle zoom
- `scale: 1.05, rotate: 2` - Zoom + slight rotation

**Example - Image zooms and brightens**:
```tsx
whileHover={{ scale: 1.08, filter: 'brightness(1.1)' }}
```

#### Card Border Glow on Hover

**Line 27**: Border color change
```tsx
className="... hover:border-primary/50 ..." // ← Change /50 to /80 for brighter glow
```

---

### 3. Page Transition Animations

**Location**: `src/pages/` (each page file)

#### Staggered Card Entrance

**Example in `Projects.tsx` line 69**:
```typescript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // ← Change 0.1 to 0.15 for slower stagger
    },
  },
};
```

**Try these**:
- `0.05` - Fast cascade
- `0.2` - Slow, dramatic entrance
- `0.15` - Medium pace

---

### 4. Navbar Logo Expansion (Your New Animation!)

**Location**: `src/components/Navbar.tsx` (line 19-55)

**Customization**:

**Line 24**: Expansion speed
```tsx
transition-all duration-300  // ← Change 300 to 500 for slower
```

**Line 25**: Max width when expanded
```tsx
max-w-0 group-hover:max-w-[3rem]  // ← Change 3rem to 4rem for more space
```

**Line 26**: Stagger delay between words
```tsx
delay-75  // ← First word
delay-150 // ← Second word (change to delay-100 for faster)
```

**Try these effects**:

**Bounce effect**:
```tsx
transition-all duration-300 ease-bounce
```

**Elastic effect**:
```tsx
transition-all duration-500 ease-elastic
```

---

## 🎨 Pre-made Animation Themes

### Theme 1: Minimal & Fast
```typescript
// ProjectCard.tsx
whileHover={{ y: -3 }}
transition={{ duration: 0.15 }}

// Image
whileHover={{ scale: 1.03 }}

// Background: Particles with fewer nodes
particleCount = 30
```

### Theme 2: Dynamic & Smooth
```typescript
// ProjectCard.tsx
whileHover={{ y: -8, scale: 1.02 }}
transition={{ duration: 0.3, type: "spring", stiffness: 300 }}

// Image
whileHover={{ scale: 1.08, rotate: 1 }}

// Background: Tron grid with fast pulse
timeRef.current += 0.04
```

### Theme 3: Bold & Dramatic
```typescript
// ProjectCard.tsx
whileHover={{ y: -10, scale: 1.05, rotateY: 5 }}
transition={{ duration: 0.4, type: "spring" }}

// Image
whileHover={{ scale: 1.12, brightness: 1.1 }}

// Background: Tron grid with high opacity
opacity: 0.9
```

---

## 🚀 Quick Customization Checklist

Want to make it yours? Change these:

- [ ] Background animation (Particles vs Tron grid)
- [ ] Background color/theme
- [ ] Project card hover lift amount
- [ ] Image zoom intensity
- [ ] Card entrance stagger speed
- [ ] Logo expansion speed
- [ ] Grid density (if using Tron)
- [ ] Pulse speed (if using Tron)

---

## 💡 Tips

1. **Test on dark mode too!** Colors look different
2. **Less is more** - Subtle animations are more professional
3. **Respect reduced motion** - Both backgrounds already do this
4. **Performance matters** - Don't go crazy with particle count
5. **Mobile testing** - Some animations may be too intense on small screens

---

## 🎯 Recommended Settings

**For Professional Look**:
- Background: Tron Grid (subtle)
- Opacity: 0.6
- Card hover: `y: -5`
- Image zoom: `scale: 1.05`

**For Creative/Portfolio Focus**:
- Background: Particles or Tron (high opacity)
- Opacity: 0.8
- Card hover: `y: -8, scale: 1.02`
- Image zoom: `scale: 1.1`

**For Minimal/Clean**:
- Background: Particles (very subtle)
- Opacity: 0.4
- Card hover: `y: -3`
- Image zoom: `scale: 1.03`

---

**Want to try the Tron background right now?**

1. Open `src/App.tsx`
2. Change import: `BackgroundAnimation` → `BackgroundAnimationTron`
3. Change usage: `<BackgroundAnimation />` → `<BackgroundAnimationTron />`
4. Save and watch! ⚡

Let me know which style you prefer!
