---
name: Warm Whimsy
colors:
  surface: '#fdf8ff'
  surface-dim: '#ddd6f5'
  surface-bright: '#fdf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f1ebff'
  surface-container-high: '#ece4ff'
  surface-container-highest: '#e6defe'
  on-surface: '#1c182f'
  on-surface-variant: '#494552'
  inverse-surface: '#312d45'
  inverse-on-surface: '#f4eeff'
  outline: '#7a7583'
  outline-variant: '#cac4d3'
  surface-tint: '#674db0'
  primary: '#644aae'
  on-primary: '#ffffff'
  primary-container: '#7d63c8'
  on-primary-container: '#fffbff'
  inverse-primary: '#cebdff'
  secondary: '#89502e'
  on-secondary: '#ffffff'
  secondary-container: '#feb289'
  on-secondary-container: '#794222'
  tertiary: '#755700'
  on-tertiary: '#ffffff'
  tertiary-container: '#936f03'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e8ddff'
  primary-fixed-dim: '#cebdff'
  on-primary-fixed: '#21005e'
  on-primary-fixed-variant: '#4e3397'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68f'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#6d3919'
  tertiary-fixed: '#ffdf9b'
  tertiary-fixed-dim: '#edc157'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#fdf8ff'
  on-background: '#1c182f'
  surface-variant: '#e6defe'
typography:
  headline-xl:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Quicksand
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Quicksand
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Quicksand
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
  label-md:
    fontFamily: Quicksand
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
  label-sm:
    fontFamily: Quicksand
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies comfort, playful reassurance, and empathetic companionship. Drawing visual inspiration from wholesome animated slice-of-life storytelling, the interface operates as a warm sanctuary where users decompress without judgment.

The visual style blends **Tactile Softness** with **Comic Whimsy**:
- Pillowy surfaces, gentle bouncy micro-interactions, and organic, rounded envelopes.
- High-contrast, friendly comic-slate typography to maintain legibility and narrative character without feeling sterile or corporate.
- Restful pastel fills layered like storybook illustration panels, evoking feelings of safety, emotional grounding, and gentle playfulness.

## Colors

The palette is tuned for emotional calm, soft energy, and storybook cheer. It replaces stark monochrome with tinted pastel environments.

- **Primary (`#8A70D6`)**: Warm pastel violet. Used for interactive focus states, primary pill buttons, avatar highlights, and reassuring progress markers.
- **Secondary (`#FFB38A`)**: Buttery warm peach. Applied to comforting active feedback, tactile badges, and companion reaction states.
- **Tertiary (`#FFD166`)**: Mellow honey yellow. Used for joyful moments, celebratory stickers, warm morning check-ins, and highlight accents.
- **Neutral (`#231F36`)**: Playful comic slate. Anchors readability across body text, outlines, and icons, avoiding the harshness of pure black while keeping strong comic definition.
- **Supportive Accents**:
  - Warm Blush Pink (`#FFAEC0`): Gentle affectionate tags and breath-pacing indicators.
  - Soothing Mint (`#A8E6CF`): Calming exercises, successful grounding states, and soothing audio sessions.
  - Cloud Base (`#FAF8FF`): Main canvas surface, providing an airy, warm off-white canvas.
  - Card Milk Tint (`#FFFFFF`): Clean foreground elevation with 95–100% opacity.

## Typography

Typography pairs the curved, soft geometric warmth of **Quicksand** for headlines and interactive tokens with the readable, clear humanism of **Nunito Sans** for emotional check-in reflections, long-form thoughts, and chat dialog.

- Headings use pronounced weight (`600` and `700`) to evoke hand-lettered storybook chapter cues while retaining balance.
- All body text maintains generous line spacing to prevent cognitive strain during high-stress usage.
- Character dialogues leverage `body-lg` to simulate personal, intimate companion spoken dialogue.

## Layout & Spacing

The layout is built on a responsive 4-column (mobile), 8-column (tablet), and 12-column (desktop) grid structured to feel cozy rather than rigid.

- **Mobile (< 768px)**: 4 columns with `margin: 1rem` and `gutter: 1rem`. Focus is kept on full-width rounded card panels and stacked emotional inputs.
- **Tablet (768px – 1024px)**: 8 columns with `margin-md: 2rem` and `gutter-md: 1.5rem`. Split-screen mode pairs the companion avatar on one side with the interactive reflection prompt on the other.
- **Desktop (> 1024px)**: Max container width constrained to `1180px` to maintain emotional closeness without vast empty voids, using `margin-lg: 3rem` and `gutter-lg: 2rem`.
- Padding scales vertically to give cards comfortable interior breathing room (`space-lg` to `space-xl`).

## Elevation & Depth

This system intentionally departs from cold, neutral drop shadows, utilizing **Tinted Ambient Cloud Shadows** and **Gentle Tactile Offsets**:

1. **Resting Layer (Ground)**: Cards sit with a soft, warm pastel shadow: `box-shadow: 0 8px 24px -4px rgba(138, 112, 214, 0.12), 0 2px 6px 0 rgba(35, 31, 54, 0.04)`.
2. **Elevated & Interactive (Hover / Focus)**: Cards and buttons float with buoyant ease: `box-shadow: 0 14px 32px -4px rgba(138, 112, 214, 0.2), 0 4px 10px 0 rgba(255, 179, 138, 0.15)`.
3. **Pushed / Active State**: Mimicking a physical squishy button or pillow depression, active items translate downwards `2px` with a compacted shadow: `box-shadow: 0 3px 8px 0 rgba(138, 112, 214, 0.18)`.
4. **Borders**: All elevated cards sport a subtle, tone-softened border (`1.5px solid rgba(138, 112, 214, 0.12)`) to give comic framing without harsh outlines.

## Shapes

The interface embraces full curved architecture:
- Every element utilizes **Pill-shaped** geometry (`roundedness: 3`). Standard elements adopt `1rem` radii, containers and interactive cards take `2rem`, and badges/buttons employ complete `9999px` capsule radii.
- Corners are deliberately softened to avoid sharp vertices, reinforcing a feeling of safety, tactility, and zero friction.

## Components

### Buttons
- **Primary Pill**: Background `#8A70D6`, text `#FFFFFF`, font `label-lg`. Padding: `0.75rem 1.75rem`. Full capsule border radius (`9999px`). Includes a slight squash-and-stretch tactile hover animation (`scale: 1.02`) and click press (`translate-y: 2px`).
- **Comfort Secondary**: Background `#FFE8DC`, text `#FF7F40`, hover background `#FFDCC9`.
- **Ghost/Tertiary**: Transparent fill, bordered with `2px dashed rgba(138, 112, 214, 0.35)`, text `#231F36`.

### Cards & Bubbly Panels
- Background: Milk tint `#FFFFFF` or pale pastel wash (`#F4EFFF` for quiet moments, `#FFF6EC` for daytime reflections).
- Radii: `2rem` (`rounded-lg`).
- Border: `1.5px solid rgba(138, 112, 214, 0.1)`.
- Internal Padding: `1.5rem` to `2rem`.

### Emotion Badges & Chips
- Soft pill capsules with an emoji slot or illustrated icon beside a `label-md` caption.
- Pale color-coded fills: Mint (`#E8F8F2`), Lavender (`#F0EBFB`), Peach (`#FFF0E8`), and Rosy Pink (`#FFEAF0`).
- Border: `1px solid currentColor` at 15% opacity.

### Cozy Chat & Comic Bubbles
- Companion bubbles are Cloud White (`#FFFFFF`) with a gentle, rounded speech tail, sitting on the left.
- User bubbles are Lavender Mist (`#EDE7FB`) without tails, sitting on the right.
- Text: `#231F36` in `body-md`.

### Animated Breathing Rings
- Concentric, soft-edged rings cycling between Warm Blush Pink (`#FFAEC0`), Soft Lavender (`#8A70D6`), and Soothing Mint (`#A8E6CF`) with low opacities (20% to 40%).
- Motion curve: Gentle ease-in-out sinusoidal expansion over 4-second inhalation and 4-second exhalation cycles.

### Input Fields
- Enclosed in `1.25rem` rounded pill fields with `#FAF8FF` background, `2px solid rgba(138, 112, 214, 0.15)` border.
- Active focus invokes a gentle warm lilac aura: `border-color: #8A70D6; box-shadow: 0 0 0 4px rgba(138, 112, 214, 0.15)`.

### Playful Checkboxes & Radio Bubbles
- Circular check items (`24px x 24px`) with a bubbly scale-pop animation when toggled on.
- Selected state fills with `#8A70D6` presenting a rounded, friendly checkmark in white.