# SARAS Lab — Project Plan

> Our own **3D robotics lab**: a fully interactive, animated 3D workbench where we design, build, wire, check and test robot designs (starting with SARAS, the Smart Autonomous Robotic AI System from Tech With Anant's videos), plus an extensible hardware library, design versions with side-by-side compare, a lab notebook for test runs, and the complete build tutorial.

| | |
|---|---|
| **Status** | v0.1 — planning. Nothing is built yet. This file is the source of truth for *what* we build and *in what order*. |
| **Source videos** | [Hardware Build (Aug 15, 2025)](https://www.youtube.com/watch?v=IT1uBUsOmUY) · [System Overview (Jul 5, 2025)](https://www.youtube.com/watch?v=e-nbSGRFP4Q) |
| **Look & feel** | Clean beige, lots of air, sticky header, serif headings, mono for pins and code. **3D-first**: wherever hardware is shown it is real, rotatable, animated 3D, never a flat image. |
| **Shape** | A personal lab for us, not a public product. Single-user, static, no backend, local-first (designs saved in the browser, exportable as JSON). |

---

## Table of contents

1. [What we are building](#1-what-we-are-building)
2. [Goals and non-goals](#2-goals-and-non-goals)
3. [Source material and what we extracted](#3-source-material-and-what-we-extracted)
4. [Users and user stories](#4-users-and-user-stories)
5. [Site map and page specs](#5-site-map-and-page-specs)
6. [Design system (beige theme, header, components)](#6-design-system)
7. [Architecture and tech stack](#7-architecture-and-tech-stack)
8. [Data model](#8-data-model)
9. [The SARAS reference build](#9-the-saras-reference-build)
10. [3D Workbench spec](#10-3d-workbench-spec) — scene, interactions, **animation spec**, chassis designer, STL import, design versions, compare, notebook
11. [Check and Test engine](#11-check-and-test-engine)
12. [Hardware library: adding your own parts](#12-hardware-library-adding-your-own-parts)
13. [Tutorial content plan](#13-tutorial-content-plan)
14. [Repository structure](#14-repository-structure)
15. [Roadmap and milestones](#15-roadmap-and-milestones)
16. [Quality bar](#16-quality-bar)
17. [Deployment](#17-deployment)
18. [Risks and mitigations](#18-risks-and-mitigations)
19. [Decisions needed from you](#19-decisions-needed-from-you)
- [Appendix A — Component dimension and power reference](#appendix-a--component-dimension-and-power-reference)
- [Appendix B — Default GPIO pin map](#appendix-b--default-gpio-pin-map)
- [Appendix C — Glossary](#appendix-c--glossary)

---

## 1. What we are building

**A personal 3D robotics lab.** The 3D Workbench is the product; everything else exists to feed it or to record what it finds. We design a robot (starting from SARAS), build it virtually, check it, test it, change it, and keep every version. The site is for us, so there is no marketing layer: the home page is the lab bench with the current design spinning on it.

1. **Workbench** — a live 3D scene you can orbit, rotate, zoom, pan and explode with the mouse, trackpad, touch or keyboard. Drag real-size components (Raspberry Pi, L298N, DC motors, 7" display, camera, ultrasonic sensors, mic, speaker, batteries) onto a chassis, snap them in, wire them pin to pin, press **Check** to find mistakes, and press **Test** to drive the robot on a virtual floor and watch the wheels, sensors, face and power rails respond. Everything is animated: parts fly into place, wires draw themselves, wheels spin, sensor cones ping, the face on the display changes state.
2. **Designs and versions** — every build is a saved design with versions. Duplicate SARAS v1, swap the L298N for a TB6612FNG and the 18650s for a LiPo, and compare the two side by side in 3D with their mass, cost, power budget and wiring differences.
3. **Chassis designer** — change length, width, tier gaps, motor offsets and wheel size with sliders and watch the chassis rebuild live, or import our own STL / GLB / OBJ from Fusion 360 and place real parts on it.
4. **Parts** — a catalog of hardware with dimensions, pins, voltages, current draw, mass and price. Every part card is a small rotating 3D model. Add our own parts through a form; the Workbench and the checker understand them immediately.
5. **Lab notebook** — each design keeps a log of test runs (check results, drive / sensor / power observations) and our own notes and photos of the physical build, so the virtual and the real robot stay in step.
6. **Tutorial** — the full SARAS build, hardware and software tracks, with every step opening the Workbench in the matching state. It is our reference while we build the physical robot.

Plus a **Cost** view (USD / INR bill of materials) per design.

What ties it together: **a single `Build` document per design version** (chassis + parts placed + wires + settings) that the Workbench edits, the checker validates, the Test mode simulates, the Cost page prices, Compare diffs, the Notebook pins entries to, and the Tutorial steps load.

```
                ┌──────────────┐        ┌──────────────┐
                │  Parts       │        │  Chassis     │  parametric plates or
                │  Library     │        │  designer    │  imported STL / GLB / OBJ
                └──────┬───────┘        └──────┬───────┘
                       │ components, pins      │ geometry
                       ▼                       ▼
┌────────────┐   ┌─────────────────────────────────┐   ┌──────────────┐
│  Tutorial  │──▶│  Design = Build document, v1…vN  │◀──│  Workbench   │  3D: place, wire, animate
│  steps     │   └───────────────┬─────────────────┘   └──────────────┘
└────────────┘                   │
         ┌──────────────┬────────┼─────────┬──────────────┐
         ▼              ▼        ▼         ▼              ▼
   ┌──────────┐   ┌──────────┐ ┌──────┐ ┌──────────┐ ┌──────────┐
   │  Check   │   │  Test    │ │ Cost │ │ Compare  │ │ Notebook │
   │  rules   │   │  sim     │ │ BOM  │ │ designs  │ │ test log │
   └──────────┘   └──────────┘ └──────┘ └──────────┘ └──────────┘
```

## 2. Goals and non-goals

### Goals

| ID | Goal | How we will know |
|---|---|---|
| G1 | A beginner can build SARAS from the tutorial alone, without watching the videos. | Every hardware step has parts, action, photo/3D state, and a checkpoint. |
| G2 | A builder can assemble and wire SARAS virtually and be told exactly what is wrong before touching hardware. | The Check panel reports zero false positives on the correct reference build. |
| G3 | Adding a new part takes under 5 minutes and needs no code. | Add-part form → part appears in Workbench drawer and passes/fails checks. |
| G4 | The three real failures from the videos are detected. | Shared power bank, motor pair polarity, and big-tire torque each fire a rule in a regression test. |
| G5 | It feels calm and professional. | Beige theme, consistent header/footer, Lighthouse ≥ 90 on all pages. |
| G6 | It works offline after first load. | PWA with precached catalog and models. |
| G7 | Hardware is always shown in real 3D that can be rotated, never as a static image. | Home bench, part cards, part detail, tutorial step panels and the Workbench all render live 3D from the same models. |
| G8 | The design loop is fast: duplicate → change → check → test → compare → record. | A new version of a design can be created, modified, tested and logged in under five minutes. |
| G9 | Animation makes the state legible, not decorative. | Every animation in §10 maps to a state change (placed, wired, failing, moving, sensing) and has a reduced-motion fallback. |

### Non-goals for v1

- No physics-accurate simulation. Movement is kinematic animation driven by the wiring, not rigid-body dynamics.
- No circuit simulation (no SPICE). Checks are rule-based: voltages, current budgets, pin conflicts, geometry.
- No accounts or backend. Builds live in the browser and in exported JSON files.
- Not a CAD tool. No mesh editing. Chassis is a parametric placeholder until real STL/STEP files are available.
- No in-site AI chat in v1.
- Not a public product: no SEO work, no marketing pages, no analytics, no sign-up. If we ever open it up, that is a separate milestone.

## 3. Source material and what we extracted

### Facts taken from the videos

**Hardware build video (Aug 15, 2025)**

- Chassis designed in Fusion 360, three tiers: motors + battery (tier 1), Raspberry Pi (tier 2), display + camera + sensors (head). 3D printed; cardboard or acrylic suggested as alternatives.
- Parts: 4× DC motors (stock small wheels swapped for larger ones), L298N motor driver, Raspberry Pi, 7-inch HDMI display, USB omnidirectional microphone, USB speaker, Raspberry Pi camera module, 3× ultrasonic sensors (front, left, right), jumper wires, standoffs, screws.
- Total cost about $150 USD, roughly ₹6,000–7,000 INR. Display is about $30 and optional.
- Fix 1 — tire clearance: motor mounts printed too far inward, so standoffs were added between chassis and motors; side benefit: shock absorption.
- Wiring: left motors paired in parallel, right motors paired in parallel, because L298N has two channels. Polarity matters; wrong polarity makes motors fight each other.
- Fix 2 — power: a dual-output (7.4 V + 5 V) power bank could not drive Pi and motors at once; a buck converter from 7.4 V to 5 V starved both. Working setup: Pi on a 5 V power bank, motors on 18650 cells. In progress: a single 7.4 V LiPo powering everything.
- Pi GPIO → L298N; keyboard arrow-key Python script for first drive test.
- Fix 3 — turning: big tires + cheap motors = not enough torque to overcome friction. Tape on the treads (Scotch → electrical → vinyl) reduced grip enough to turn.
- Head: speaker holder blocks act as the neck; display mount; camera above the display (initially installed upside down); USB mic and speaker; three ultrasonic sensors.
- A SARAS 2.0 is planned: fully offline, no cloud.

**System overview video (Jul 5, 2025)**

- Wake word "Hey SARAS" via a local wake-word detector; speech-to-text; LLM (local Llama or ChatGPT); LLaVA for vision; text-to-speech back out.
- Face states on the display: neutral/idle, blinking = listening, thinking, talking mouth.
- Manual mode with an Xbox controller.
- Voice movement commands: forward, backward, left, right, stop.
- "What do you see" → camera frame → vision model → spoken description.
- "Go to the boxes / couch" → look for object, move toward it, stop before contact using the front ultrasonic sensor.
- "Start exploring" → autonomous exploration with a saved move history fed back into each decision; logs direction, obstacle distances, and what was seen; ends with a spoken mission report. Future: 2D map from logs.

### Unknowns we must fill ourselves (flag in the UI as "assumed")

| Unknown | Our default | Why it matters |
|---|---|---|
| Exact Raspberry Pi model | Pi 4 Model B | Pin header is the same across 3B+/4/5, but power budget and GPIO library differ. |
| Exact display model | Generic 7" 1024×600 HDMI, USB-powered | Dimensions and 5 V draw. |
| Wheel diameter after the swap | 85 mm (stock TT wheel is 65 mm) | Drives the torque/friction rule. |
| GPIO pin assignments | Appendix B | Not shown on screen; we propose a clean map. |
| Software stack details | Standard open-source choices (see §13) | The creator's software video was not out at the time of the transcripts. |

## 4. Users and user stories

**Primary user: us.** This is a personal lab. One or two people designing, building and testing robots, on a desktop with a mouse most of the time, and on a phone or tablet to look at a design or check a wiring table next to the physical robot.

**Secondary user: someone we hand a design JSON to** (a friend, a collaborator), who opens it on their own copy of the site. No accounts, no server.

**Stories**

| ID | I want to… | So that… |
|---|---|---|
| U1 | open the site and see my current design spinning in 3D, grab it and rotate it | I'm on the bench immediately |
| U2 | drag a part from the drawer onto the chassis and see it snap in with a small drop animation | placement feels physical and I can tell it landed |
| U3 | click two pins and watch a wire draw itself between them | I can plan wiring without a breadboard |
| U4 | press Check and see failing parts pulse in 3D with a plain-language fix | I catch reversed motor polarity before the robot spins in place |
| U5 | press Test and drive with the arrow keys or a gamepad while the wheels spin and the face reacts | I see the robot move the way my wiring would make it move |
| U6 | press Play and watch the whole robot assemble itself tier by tier | I understand the build order before I pick up a screwdriver |
| U7 | move the chassis sliders (length, width, tier gap, motor offset, wheel size) and watch it rebuild | I can test a design change in seconds |
| U8 | import my Fusion 360 STL and place real parts on it | the virtual build matches what I'm printing |
| U9 | duplicate a design, change it, and compare both side by side in 3D | I can see what the LiPo version changes in mass, cost and power |
| U10 | record a test run with notes and a photo of the real robot | the notebook remembers what worked |
| U11 | add a part that isn't in the catalog by filling a form | my own hardware is covered by the checks |
| U12 | export a `config.py` with the pin map from my design | my Python code matches my wiring |
| U13 | see total cost in INR and USD, with the display toggled off | I can decide what to skip |
| U14 | follow a tutorial step with the matching 3D state beside it | I don't install the camera upside down |
| U15 | export a design as JSON (parts it depends on included) and import it on another machine | I can move between my laptop and desktop |

## 5. Site map and page specs

```
/                         Lab (home): current design live in 3D, my designs, recent tests, quick actions
/workbench/:designId      3D Workbench (full-bleed)
/designs                  All designs and their versions
/designs/compare          Side-by-side 3D compare (?a=<design@v>&b=<design@v>)
/chassis/:designId        Chassis designer: parametric sliders, STL / GLB / OBJ import
/notebook/:designId       Lab notebook: test runs, notes, photos
/cost/:designId           Cost & BOM for one design
/parts                    Parts library (browse, filter, compare), every card a live 3D thumbnail
/parts/:id                Part detail (large 3D preview, pins, power, dimensions, links)
/parts/new                Add a part (form → JSON)
/tutorial                 Tutorial overview (two tracks + troubleshooting)
/tutorial/hardware/:n     Hardware step n, with the matching 3D state
/tutorial/software/:n     Software step n
/tutorial/troubleshooting
/docs                     Data format, keyboard shortcuts, 3D controls, FAQ
/about                    Credits (Tech With Anant), licenses, changelog
```

One **persistent WebGL canvas** sits behind the whole app (drei `View` tiles it into as many viewports as a page needs), so navigating between pages never reloads the 3D context and the small 3D thumbnails on cards cost one draw call each, not one context each.

### Header (global, every page)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ◉ SARAS Lab     Lab  Workbench  Designs  Parts  Tutorial  Docs      ⌘K  ⎇  │
└─────────────────────────────────────────────────────────────────────────────┘
   logo + wordmark          primary nav (active = underline)     search  GitHub
```

- Sticky, 64 px tall, background `--bg` with a 1 px `--line` bottom border; becomes slightly translucent with blur on scroll.
- Left: a small robot glyph (two round "eyes" in a rounded square, matches the display face) + wordmark "SARAS Lab" in the heading serif.
- Center: six links. Active link gets a 2 px terracotta underline. Hover gets `--ink`.
- Right: search button (opens a command palette: designs, parts, tutorial steps, rules), GitHub link, and on `/workbench` an extra **design switcher** ("SARAS v1 ▾") and **Save state** chip ("Saved · 2 min ago" / "Unsaved").
- Under 900 px: nav collapses into a menu button that opens a right-side sheet with the same links, large tap targets.
- A thin 2 px progress bar under the header on tutorial pages shows position within the track.

### Footer (global)

Three columns: *Build* (Workbench, Parts, Cost), *Learn* (Tutorial, Troubleshooting, Docs), *Project* (About, GitHub, Changelog). Bottom line: "Based on SARAS by Tech With Anant · Content CC BY-SA 4.0 · Code MIT" (licenses to be confirmed, see §19).

### Lab `/` (home)

The bench, not a landing page. The left two-thirds is a live 3D viewport of the current design.

```
┌───────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                │
├───────────────────────────────────────────┬───────────────────────────┤
│  ┌─────────────────────────────────────┐  │  MY DESIGNS        + New  │
│  │  live 3D: current design            │  │  ┌─────────┐ ┌─────────┐  │
│  │  slow auto-orbit until touched,     │  │  │ 3D thumb│ │ 3D thumb│  │
│  │  drag to rotate, wheel to zoom,     │  │  │ SARAS v1│ │ v2 LiPo │  │
│  │  scroll the page → tiers explode    │  │  └─────────┘ └─────────┘  │
│  │                                     │  │  ┌─────────┐              │
│  │  [Iso][Top][Front][Side]  explode ─●│  │  │ 3D thumb│              │
│  └─────────────────────────────────────┘  │  │ 2.0 scaf│              │
│  SARAS v1 · 0 fail · 2 warn · $152 ·      │  └─────────┘              │
│  1.9 kg · 5 V rail 2.3 A typ              │  RECENT TESTS             │
│  [ Open Workbench ]  [ Test ▶ ]  [ Play ] │  v2 LiPo · drive ok ·     │
│                                           │  5 V warn · 2 h ago       │
├───────────────────────────────────────────┴───────────────────────────┤
│  Quick actions: Continue tutorial step 7 · Add part · Import STL · Compare │
├───────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                               │
└───────────────────────────────────────────────────────────────────────┘
```

- The viewport is the real Workbench scene in read-only mode; **Open Workbench** keeps the camera where you left it.
- **Play** runs the assembly animation (§10) in place.
- Design cards are live 3D thumbnails that start a slow spin on hover.

### Workbench `/workbench/:designId`

Full-bleed below the header. See §10 for behaviour.

```
┌──────────┬───────────────────────────────────────────────┬──────────────┐
│ PARTS    │                                               │ INSPECTOR    │
│ drawer   │                 3D VIEWPORT                   │ selected     │
│ search   │        (orbit / pan / zoom, grid, chassis)    │ part: pins,  │
│ by       │                                               │ position,    │
│ category │   [iso][top][front][side]   explode ──●────   │ rotation,    │
│          │                                               │ power, notes │
│ + Add    │                                               │              │
│ part     │                                               │ CHECKS (12)  │
│          │                                               │ ● 0 fail     │
│          │                                               │ ● 2 warn     │
├──────────┴───────────────────────────────────────────────┴──────────────┤
│ BOTTOM PANEL  [Wiring table] [Checks] [Test console] [BOM]   ▲ collapse │
└─────────────────────────────────────────────────────────────────────────┘
 toolbar (floating, top-left of viewport): Select · Move · Rotate · Wire · Measure · Undo/Redo · Save · Versions ▾ · Play ▶ · Check ✓ · Test ▶
```

### Parts `/parts`

- Left filter rail: category, voltage range, interface (GPIO, I2C, SPI, USB, CSI, HDMI), "in my build", "my parts".
- Grid of cards: name, category chip, a **live 3D thumbnail** (procedural body or GLB, slow spin on hover), key specs (V, A, mm, price), **Add to design** button.
- Compare drawer: pick up to 3 parts, side-by-side spec table.

### Part detail `/parts/:id`

- Large interactive 3D preview: orbit, zoom, pin markers with labels on hover, a **flip** button, and a toggle that shows the part's mounting footprint and clearance box.
- Tabs: Overview · Pins · Power · Dimensions · Used in tutorial steps · Links.
- "Known gotchas" callouts (e.g., HC-SR04 echo is 5 V; L298N drops ~2 V).

### Add a part `/parts/new` — see §12.

### Tutorial `/tutorial` — see §13.

- Overview page shows the two tracks as vertical steppers with time estimates and a "you'll need" strip per step.
- Step page layout: left = content (MDX), right = sticky panel with the Workbench state for this step (small 3D view + "Open in Workbench"), the parts needed, and the checkpoint.
- Prev/Next at the bottom; keyboard `[`/`]`.

### Designs `/designs` and compare

- Grid of designs; each card a live 3D thumbnail, name, version count, last tested, status chips (fails / warns), cost, mass.
- Open a design to see its versions as a vertical timeline (v1 → v2 → v3) with a one-line change note each; click a version to load it into the Workbench or to set it as the compare base.
- **Compare** (`/designs/compare`): two synced 3D viewports (orbiting one orbits the other), a diff table underneath: parts added / removed / moved, wires added / removed, mass, cost, rail budgets, check results. "Swap sides" and "Overlay" (ghost B over A) modes.

### Chassis designer `/chassis/:designId`

- Left: sliders for length, width, tier count, tier gap, plate thickness, corner radius, motor outboard offset, wheelbase, wheel diameter, standoff grid. Right: the chassis rebuilds live in 3D with parts still mounted, and the checker re-runs (MECH-002 clearance, MECH-003 centre of mass).
- **Import** STL / GLB / OBJ (drag and drop or file picker). Units prompt (mm / cm / inch), auto-centre, auto-orient, scale check against a 100 mm bar, name it (base plate, tier 2, head frame). Imported meshes become `chassis.parts[]` with their own transforms, and parts snap to their faces.
- Export the parametric chassis as STL for printing (stretch).

### Lab notebook `/notebook/:designId`

- A chronological log per design. Entries are created automatically when Test runs (report attached) and manually (markdown note + photos, stored in IndexedDB).
- Each entry pins the design version it was made against, so an old note still opens the right 3D state.
- Filter by type (test, note, photo, checkpoint), export the notebook as markdown.

### Cost `/cost/:designId`

- Table of the design's parts with qty, unit price (USD and INR, editable), subtotal. Comparing versions shows the delta.
- Toggles: "Skip display (−$30)", "I have a 3D printer" (removes acrylic/cardboard line), currency.
- Shipping/tax fields, region presets (US, India).
- Export CSV. Numbers are editable because prices drift; defaults carry a "last updated" date.

### Docs `/docs`

Design/Build JSON format, part JSON format, keyboard shortcuts, 3D controls (mouse, trackpad, touch, gamepad), how checks work, how to add a part, FAQ.

## 6. Design system

### Palette (beige, warm, low contrast surfaces, high contrast text)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F4EFE6` | page background (parchment beige) |
| `--bg-elev` | `#FBF8F2` | cards, header, drawers |
| `--bg-sunken` | `#EAE2D3` | code blocks, table stripes, viewport floor |
| `--line` | `#DDD3C0` | borders, dividers |
| `--line-strong` | `#C9BBA3` | focused borders, table header rule |
| `--ink` | `#2A2420` | primary text (espresso) |
| `--ink-2` | `#5C524A` | secondary text |
| `--ink-3` | `#8A7F74` | placeholders, captions |
| `--accent` | `#B5542D` | terracotta: primary buttons, active nav, links |
| `--accent-ink` | `#FFF8F0` | text on accent |
| `--pass` | `#5F6F52` | olive: checks passed |
| `--warn` | `#C9922B` | amber: warnings |
| `--fail` | `#A8402F` | failures |
| `--info` | `#3F6E8C` | slate blue: signal wires, info callouts |

Wire colours in the 3D scene follow electronics convention, not the theme: 5 V red `#C83C32`, 7.4 V / VIN orange `#D97A1F`, GND black `#1B1917`, 3.3 V yellow `#D9B23A`, signals `--info`, PWM teal `#2E8A86`, data buses (I2C/SPI/UART) purple `#6F5BA8`.

Contrast: `--ink` on `--bg` ≈ 13:1. `--accent` on `--bg` ≈ 4.7:1 (fine for links and large text; buttons use `--accent-ink` on `--accent`). `--ink-3` is caption-only.

Dark mode: not in v1. The tokens are structured so a "night bench" theme can be added later by redefining them under `[data-theme="dark"]`.

### Typography

| Role | Font | Notes |
|---|---|---|
| Headings, wordmark | **Fraunces** (variable, soft serif) | optical size 72–144, weight 500–600, slight negative tracking on display sizes |
| Body, UI | **Inter** | 16 px base, 1.6 line height, max 68 ch measure in prose |
| Pins, code, numbers | **JetBrains Mono** | tabular numerals in tables |

Scale: 12 · 14 · 16 · 18 · 22 · 28 · 36 · 48 · 64. Headings use Fraunces from 22 up.

### Spacing, radius, shadow

- 4 px base grid; component padding 12/16/24; section gaps 64/96.
- Radius: 6 px controls, 12 px cards, 20 px hero media.
- Shadows are nearly invisible on beige; use borders first, and a single soft shadow (`0 8px 24px rgba(42,36,32,0.08)`) for floating panels only.

### Components

Button (primary terracotta, secondary outline, ghost, icon), Card, Badge/Chip (category, pass/warn/fail), Table (sticky header, zebra with `--bg-sunken`), Tabs, Drawer/Sheet, Tooltip, Popover, Command palette, Stepper (vertical for tutorial overview, horizontal compact in step header), Callout (Note · Warning · **From the real build**), Code block with copy, KPI tile (cost, current, mass), Slider (explode view), Segmented control (view presets), Toast, Empty state, Skeleton.

### Motion and accessibility

- 150–200 ms ease-out for UI; the 3D hero orbits at ~6°/s and stops on hover.
- Respect `prefers-reduced-motion`: no auto-orbit, no explode animation, instant transitions.
- Focus rings: 2 px `--accent` outside offset; every 3D action has a keyboard or panel equivalent (the Wiring table is the keyboard-only path for wiring).
- Minimum tap target 40 px; header nav 44 px.

### Responsive

- ≥ 1200: full three-column Workbench.
- 900–1199: parts drawer collapses to icons; inspector becomes an overlay.
- < 900: Workbench is view + bottom sheet (place/wire via lists, not drag); tutorial and parts pages reflow to one column.

## 7. Architecture and tech stack

### Decision

| Layer | Choice | Why |
|---|---|---|
| Build tool / framework | **Vite + React 18 + TypeScript** | Fast, static output, huge ecosystem for the 3D part. |
| 3D | **three.js** via **@react-three/fiber** + **@react-three/drei** | Declarative scene that shares React state with the UI; drei gives OrbitControls, TransformControls, HTML labels, GLTF loading, lines, environment lighting. |
| Camera and animation | drei **`CameraControls`** (camera-controls) for damped orbit and camera flights; **`@react-spring/three`** for tweens on parts, wires and gizmos; **`maath`** for damping helpers | Smooth, interruptible animation that shares React state. |
| Post-processing | **`@react-three/postprocessing`** (selective outline for selection/failures; soft AO) | Readable selection on a beige scene without harsh outlines. |
| Loaders | **three-stdlib** STL / OBJ / GLTF + Draco | Import our own chassis files; load catalog GLBs. |
| Files | **`idb-keyval`** (IndexedDB) for imported meshes and notebook photos; **`lz-string`** for share URLs | Large binary blobs don't belong in localStorage. |
| State | **Zustand** (+ `persist` to localStorage, + `temporal` for undo/redo) | Tiny, works outside React (the rule engine and sim read the same store). |
| Styling | **CSS variables (tokens.css) + Tailwind** | Tokens keep the beige theme in one place; Tailwind speeds up layout. |
| Routing | **React Router v7** (library mode) | Static, simple, nested layouts for header/footer. |
| Content | **MDX** for tutorial steps | Steps can embed interactive components (`<WorkbenchState step="motors" />`, `<PinTable />`). |
| Schema / validation | **Zod** | One schema generates TS types, validates catalog JSON and user-added parts, and powers the add-part form. |
| Tests | **Vitest** (engine, schema, stores) · **Playwright** (e2e, visual snapshots of key pages) | |
| Lint / format | ESLint + Prettier | |
| Deploy | **GitHub Pages** via GitHub Actions (default) or Vercel | Static output, no server. |

### Alternatives considered

- **Astro + React islands**: superb for the tutorial, but the Workbench is an app with shared state across panels; splitting islands complicates it. Can revisit if tutorial SEO becomes a priority.
- **Next.js**: no server needed; adds weight.
- **Plain three.js without React**: more manual UI plumbing for drawers/inspector; R3F's ecosystem wins.
- **Babylon.js**: capable, but R3F + drei is the faster path for a React UI.

### Key runtime pieces

- `catalog/`: built-in parts as JSON, loaded and validated at startup; user parts merged from localStorage.
- `workbench/`: scene graph derived from the `Build` document; no scene-only state except camera and hover.
- `engine/`: pure functions `check(build, catalog) → CheckResult[]` and `simulate(build, input, dt) → frame`. No DOM, no three.js; fully unit-testable.
- `tutorial/`: MDX files with front-matter (`step`, `track`, `parts`, `buildState`, `videoRef`).

## 8. Data model

All units: **millimetres, grams, volts, amps, USD**. INR shown via an editable rate (default 84 ₹/$ with a "last updated" date).

```ts
// ---- Catalog ---------------------------------------------------------------

type Category =
  | 'compute' | 'motor-driver' | 'motor' | 'wheel' | 'sensor' | 'camera'
  | 'display' | 'audio' | 'power' | 'regulator' | 'mechanical' | 'wiring' | 'misc';

type PinKind =
  | 'power-in' | 'power-out' | 'gnd'
  | 'gpio' | 'pwm' | 'signal-in' | 'signal-out' | 'analog'
  | 'i2c-sda' | 'i2c-scl' | 'spi' | 'uart-tx' | 'uart-rx'
  | 'motor-out' | 'motor-in'            // driver outputs / motor terminals
  | 'usb-host' | 'usb-device' | 'hdmi' | 'csi' | 'audio-jack';

interface Pin {
  id: string;                 // 'IN1', 'GPIO17', 'VS', 'ECHO'
  label: string;
  kind: PinKind;
  voltage?: { nominal: number; min?: number; max?: number }; // what it outputs or tolerates
  currentMaxA?: number;       // for power-out / motor-out
  position: [number, number, number]; // local mm offset for the 3D pin marker
  group?: string;             // 'header-40', 'screw-terminal-left'
  notes?: string;             // 'ECHO is 5 V; divide to 3.3 V before a Pi GPIO'
}

interface Body {
  shape: 'box' | 'cylinder' | 'pcb' | 'wheel' | 'gltf';
  size: [number, number, number];   // w × d × h in mm (cylinder: diameter, diameter, length)
  color?: string;                   // procedural body colour
  model?: string;                   // '/models/raspberry-pi-4b.glb' when shape === 'gltf'
  mountHoles?: Array<[number, number]>; // mm, for snapping to standoffs
  anchors?: Array<{ id: string; position: [number, number, number]; facing: 'up'|'down'|'front'|'back'|'left'|'right' }>;
}

interface PowerSpec {
  supplyV?: { min: number; max: number };     // what it needs
  typicalA?: number;
  maxA?: number;                              // worst case / stall
  providesV?: number;                         // sources and regulators
  providesMaxA?: number;
  capacityWh?: number;                        // batteries
}

interface Component {
  id: string;                 // 'raspberry-pi-4b'
  name: string;
  category: Category;
  role?: 'brain' | 'driver' | 'drive' | 'sense' | 'see' | 'hear' | 'speak' | 'face' | 'power' | 'structure';
  body: Body;
  massG?: number;
  pins: Pin[];
  power?: PowerSpec;
  price?: { usd?: number; inr?: number; updated: string; url?: string };
  tags?: string[];
  gotchas?: string[];         // shown on the detail page and used by rules
  source: 'builtin' | 'user';
  version: 1;
}

// ---- Build -----------------------------------------------------------------

interface Placement {
  instanceId: string;         // 'motor-fl'
  componentId: string;
  label?: string;             // 'Front-left motor'
  tier: 'base' | 'tier2' | 'head' | 'free';
  position: [number, number, number];
  rotation: [number, number, number];   // degrees
  mirrored?: boolean;
  settings?: Record<string, unknown>;    // e.g. { wheelDiameterMm: 85 }, { jumperENA: true }
}

interface Connection {
  id: string;
  from: { instanceId: string; pinId: string };
  to:   { instanceId: string; pinId: string };
  net?: string;               // auto-derived: '5V', 'GND', 'VIN', 'GPIO17'
  via?: 'wire' | 'cable' | 'ribbon' | 'usb' | 'hdmi';
  color?: string;
}

interface ChassisParams {              // drives the parametric generator (§10)
  lengthMm: number; widthMm: number;
  tiers: number; tierGapMm: number; plateMm: number; cornerRadiusMm: number;
  motorOutboardMm: number;             // the "standoff fix" from the video
  wheelbaseMm: number; wheelDiameterMm: number;
  standoffGridMm: 5 | 10;
}

interface ImportedMesh {               // our own STL / GLB / OBJ, stored in IndexedDB
  id: string; name: string; blobId: string; format: 'stl' | 'glb' | 'obj';
  unit: 'mm' | 'cm' | 'in'; position: [number, number, number]; rotation: [number, number, number];
  role?: 'base' | 'tier2' | 'head' | 'other'; triangles: number;
}

interface ChassisSpec {
  mode: 'parametric' | 'imported' | 'mixed';
  params: ChassisParams;
  meshes: ImportedMesh[];
}

interface Build {                      // one design version's full state
  schemaVersion: 1;
  chassis: ChassisSpec;
  placements: Placement[];
  connections: Connection[];
  assumptions: Record<string, string>;  // e.g. piModel: 'Pi 4 Model B'
}

// ---- Designs, versions, notebook ----------------------------------------

interface DesignVersion {
  id: string;                 // 'v3'
  note: string;               // 'swap 18650s for 2S LiPo + UBEC'
  build: Build;
  createdAt: string;
  parentId?: string;          // version this was duplicated from
}

interface Design {
  id: string;
  name: string;               // 'SARAS v1', 'SARAS LiPo', 'SARAS 2.0 scaffold'
  versions: DesignVersion[];
  working: Build;             // autosaved working copy (unsaved changes live here)
  createdAt: string; updatedAt: string;
}

interface NotebookEntry {
  id: string;
  designId: string; versionId: string;
  type: 'test' | 'note' | 'photo' | 'checkpoint';
  createdAt: string;
  markdown?: string;
  report?: TestReport;        // attached automatically by Test mode
  photoBlobIds?: string[];    // IndexedDB
}

// ---- Engine outputs --------------------------------------------------------

interface CheckResult {
  ruleId: string;             // 'PWR-004'
  severity: 'fail' | 'warn' | 'info' | 'pass';
  title: string;
  detail: string;             // plain language, one paragraph max
  fix?: string;               // what to do
  tutorialRef?: string;       // '/tutorial/hardware/6'
  subjects: Array<{ instanceId?: string; pinId?: string; connectionId?: string }>; // highlighted in 3D
}
```

### Example: L298N (abridged)

```json
{
  "id": "l298n-module",
  "name": "L298N dual H-bridge motor driver module",
  "category": "motor-driver",
  "role": "driver",
  "body": { "shape": "pcb", "size": [43, 43, 27], "color": "#B4382E", "mountHoles": [[3,3],[40,3],[3,40],[40,40]] },
  "massG": 26,
  "power": { "supplyV": { "min": 5, "max": 35 }, "providesV": 5, "providesMaxA": 0.5 },
  "pins": [
    { "id": "VS",  "label": "12V / VS", "kind": "power-in",  "voltage": { "nominal": 7.4, "min": 5, "max": 35 }, "position": [2, 20, 10], "group": "power-terminal" },
    { "id": "GND", "label": "GND",      "kind": "gnd",       "position": [2, 25, 10], "group": "power-terminal" },
    { "id": "5V",  "label": "+5V",      "kind": "power-out", "voltage": { "nominal": 5 }, "currentMaxA": 0.5, "position": [2, 30, 10], "group": "power-terminal", "notes": "Only when the 5V-EN jumper is on and VS ≤ 12 V. Do not power a Pi 4 from it." },
    { "id": "ENA", "label": "ENA", "kind": "pwm", "position": [20, 2, 10], "group": "logic" },
    { "id": "IN1", "label": "IN1", "kind": "signal-in", "position": [23, 2, 10], "group": "logic" },
    { "id": "IN2", "label": "IN2", "kind": "signal-in", "position": [26, 2, 10], "group": "logic" },
    { "id": "IN3", "label": "IN3", "kind": "signal-in", "position": [29, 2, 10], "group": "logic" },
    { "id": "IN4", "label": "IN4", "kind": "signal-in", "position": [32, 2, 10], "group": "logic" },
    { "id": "ENB", "label": "ENB", "kind": "pwm", "position": [35, 2, 10], "group": "logic" },
    { "id": "OUT1", "label": "OUT1", "kind": "motor-out", "currentMaxA": 2, "position": [2, 5, 10],  "group": "motor-a" },
    { "id": "OUT2", "label": "OUT2", "kind": "motor-out", "currentMaxA": 2, "position": [2, 9, 10],  "group": "motor-a" },
    { "id": "OUT3", "label": "OUT3", "kind": "motor-out", "currentMaxA": 2, "position": [41, 5, 10], "group": "motor-b" },
    { "id": "OUT4", "label": "OUT4", "kind": "motor-out", "currentMaxA": 2, "position": [41, 9, 10], "group": "motor-b" }
  ],
  "gotchas": [
    "Drops about 2 V between VS and the motors; a 7.4 V pack gives the motors roughly 5.4 V.",
    "2 A per channel. Two TT motors in parallel can exceed this at stall."
  ],
  "price": { "usd": 3, "inr": 180, "updated": "2026-10-26" },
  "source": "builtin",
  "version": 1
}
```

### Nets

Nets are derived, not stored: union-find over connections, seeded by pin kinds (`gnd` pins join GND; a `power-out` pin names its net by voltage). This is what the power rules reason about.

## 9. The SARAS reference build

The preset that loads by default. Dimensions are nominal; see Appendix A for the full table and sources to verify against.

### Parts list

| # | Part | Qty | Tier | Role | Approx. price (USD) |
|---|---|---|---|---|---|
| 1 | Raspberry Pi 4 Model B (assumed) | 1 | tier2 | brain | 45–60 |
| 2 | 7" HDMI display 1024×600 | 1 | head | face | 30 |
| 3 | Raspberry Pi Camera Module (v2 assumed) | 1 | head | see | 10–15 |
| 4 | L298N motor driver module | 1 | base | driver | 3 |
| 5 | TT DC gear motor (yellow, 1:48) | 4 | base | drive | 2 each |
| 6 | Wheel, 85 mm (user-swapped; stock 65 mm) | 4 | base | drive | 2 each |
| 7 | HC-SR04 ultrasonic sensor | 3 | head | sense | 1.5 each |
| 8 | USB omnidirectional microphone | 1 | head | hear | 8–12 |
| 9 | USB speaker | 1 | head | speak | 8–12 |
| 10 | 5 V USB power bank (for the Pi) | 1 | base | power | 10–15 |
| 11 | 18650 cell ×2 in a 2S holder (for motors) | 1 | base | power | 8 |
| 12 | Standoffs M2.5/M3 kit, screws, jumper wires | 1 | all | structure | 8 |
| 13 | 3D-printed chassis (3 tiers, mounts) or cardboard/acrylic | 1 | all | structure | filament ≈ 5 |

Total lands in the $140–165 range, consistent with the video's "around $150". INR total is computed live in `/cost`.

### Tiers and stacking

```
HEAD      ┌─────────────────────────────┐   camera on top edge, display facing forward,
          │  [cam]  ┌───────────┐       │   mic + speaker behind the display,
          │         │  display  │ [us-L]│   ultrasonic front / left / right at the rim
          │ [us-F]  └───────────┘ [us-R]│
          └─────────────────────────────┘
          ‖ speaker-holder blocks = "neck"
TIER 2    ┌─────────────────────────────┐   Raspberry Pi on 4 standoffs,
          │        [ Raspberry Pi ]     │   power bank bay underneath (retained by standoffs)
          └─────────────────────────────┘
          ‖ standoffs
BASE      ┌─────────────────────────────┐   L298N centre, 2S 18650 holder rear,
   (o)════│ [M]   [ L298N ]  [18650x2]  │════(o)   4 TT motors on standoffs pushed outward
   (o)════│ [M]                     [M] │════(o)   for big-tire clearance
          └─────────────────────────────┘
```

Chassis preset parameters: length 200 mm, width 150 mm, tier gap 45 mm, motor outboard offset 12 mm (the standoff fix), wall 3 mm. These are placeholders until the real Fusion 360 files are available (see §19).

### Wiring table (reference)

| From | Pin | To | Pin | Net | Note |
|---|---|---|---|---|---|
| 18650 2S holder | + | L298N | VS | VIN 7.4 V | |
| 18650 2S holder | − | L298N | GND | GND | |
| L298N | GND | Raspberry Pi | GND (pin 6) | GND | **common ground is mandatory** |
| L298N | OUT1 | Motor FL | + | motor-A | FL and RL in parallel, same polarity |
| L298N | OUT2 | Motor FL | − | motor-A | |
| L298N | OUT1 | Motor RL | + | motor-A | |
| L298N | OUT2 | Motor RL | − | motor-A | |
| L298N | OUT3 | Motor FR | + | motor-B | FR and RR in parallel, same polarity |
| L298N | OUT4 | Motor FR | − | motor-B | |
| L298N | OUT3 | Motor RR | + | motor-B | |
| L298N | OUT4 | Motor RR | − | motor-B | |
| Raspberry Pi | GPIO17 | L298N | IN1 | | left direction A |
| Raspberry Pi | GPIO27 | L298N | IN2 | | left direction B |
| Raspberry Pi | GPIO22 | L298N | IN3 | | right direction A |
| Raspberry Pi | GPIO23 | L298N | IN4 | | right direction B |
| Raspberry Pi | GPIO18 | L298N | ENA | PWM | remove ENA jumper |
| Raspberry Pi | GPIO13 | L298N | ENB | PWM | remove ENB jumper |
| Raspberry Pi | 5V (pin 2) | HC-SR04 front | VCC | 5 V | ×3 sensors |
| Raspberry Pi | GND | HC-SR04 front | GND | GND | |
| Raspberry Pi | GPIO5 | HC-SR04 front | TRIG | | |
| HC-SR04 front | ECHO | Raspberry Pi | GPIO6 | | **through 1 kΩ / 2 kΩ divider** |
| Raspberry Pi | GPIO24 / GPIO25 | HC-SR04 left | TRIG / ECHO | | divider on ECHO |
| Raspberry Pi | GPIO16 / GPIO26 | HC-SR04 right | TRIG / ECHO | | divider on ECHO |
| Raspberry Pi | CSI | Camera | ribbon | | contacts facing the right way; orientation flag in settings |
| Raspberry Pi | micro-HDMI 0 | Display | HDMI | | |
| Power bank | USB-A | Display | micro-USB power | 5 V | or from a second bank port |
| Power bank | USB-A → USB-C | Raspberry Pi | USB-C PWR | 5 V | 3 A port |
| Raspberry Pi | USB | Mic | USB | | |
| Raspberry Pi | USB | Speaker | USB | | |

### Power budget (worst case, what the checker computes)

| Rail | Loads | Typical | Worst case | Supply in reference build | Verdict |
|---|---|---|---|---|---|
| 5 V (Pi side) | Pi 4B 1.2 A, display 0.7 A, mic+speaker 0.4 A, 3× HC-SR04 0.05 A | ≈ 2.3 A | ≈ 3.5 A | one 5 V bank, 2.4–3 A port | **warn**: marginal; run the display from a second port or a 3 A PD source |
| VIN 7.4 V (motors) | 4× TT motor, ≈ 0.2 A each cruising, ≈ 1.2 A each stall | ≈ 0.8 A | ≈ 4.8 A | 2S 18650, 2–3 A continuous recommended | **warn** at stall; fine in practice because stall is brief, and PWM duty limits it |
| L298N channel | 2 motors in parallel | 0.4 A | 2.4 A | 2 A per channel | **warn**: exceeds channel rating at stall; TB6612FNG or one motor per channel is the clean fix |

The exact failure from the video is a separate rule: one power bank feeding both the Pi rail and the motor rail → **fail** `PWR-004` with the explanation that most banks serve one port under load and shut the other down, and the recommended path (2S LiPo → L298N VS directly, and the same LiPo → a 5 V / 5 A UBEC → Pi USB-C, common ground).

## 10. 3D Workbench spec

### Scene

- Units: 1 scene unit = 1 mm. Camera near 1, far 5000. Scene centred on the chassis origin (base plate centre, top surface at z = 0; z up in data, converted to y-up for three.js).
- Floor: a soft beige plane (`--bg-sunken`) with a 10 mm minor / 50 mm major grid; a 100 mm scale bar in the corner.
- Lighting: hemisphere light + one soft directional with contact shadows (drei `ContactShadows`), no harsh specular. Environment from a neutral studio HDR at low intensity so PCBs read as PCBs.
- Chassis: parametric 3-tier model generated from `chassis.params` (plates with rounded corners, standoff posts, motor mounts, wheel cut-outs). Swappable for a GLB when real files exist.

### Bodies

- Procedural bodies from `Body.shape` + `size`: `box` (rounded), `cylinder` (motors, cells), `pcb` (thin board with a header-block and silkscreen-coloured top), `wheel` (tyre + hub with a tread line so rotation is visible), `gltf` (loaded model, auto-fitted to `size`).
- Each pin gets a small sphere marker at `Pin.position`; markers show on hover/selection or in Wire mode; a drei `Html` label shows `label` and `kind`.
- Selection: outline via a post-processing pass (or a slightly brighter emissive); hover: cursor change + label.

### Interactions

| Action | Mouse / touch | Keyboard |
|---|---|---|
| Orbit / pan / zoom | left drag / right drag / wheel | arrows (orbit), `+`/`-` |
| Add part | drag a card from the drawer onto a surface, or click **Add** (places at tier centre) | `/` focus search, `Enter` adds |
| Move | drag the part along its tier plane; `Shift` for vertical | `W` tool, arrows nudge 1 mm, `Shift` 10 mm |
| Rotate | `R` tool, ring gizmo | `R`, `[`/`]` 15°, `Shift` 90° |
| Snap | magnet toggle: 5 mm grid, mount holes → standoffs, anchors → anchors | `S` |
| Wire | `E` tool: click pin A, click pin B; `Esc` cancels; `Shift` chains from the last pin | Wiring table: pick from/to with comboboxes |
| Delete | `Delete` / `Backspace`; wires attached to a deleted part are deleted with a toast + undo | |
| Undo / redo | | `Ctrl/⌘ Z`, `Ctrl/⌘ Shift Z` |
| Views | segmented control: Iso · Top · Front · Side | `1`–`4` |
| Explode | slider 0–100% separates tiers vertically and lifts parts 0–40 mm | |
| Measure | `M` tool: click two points, shows mm | |
| Check / Test | toolbar buttons | `Ctrl/⌘ Enter` / `T` |

### Wires

- Rendered as smooth tubes (quadratic Bézier with a sag/lift control point so wires arc over the board rather than cut through it), 1.2 mm diameter, coloured by net.
- A wire's endpoints follow their parts when moved.
- Hovering a wire highlights both pins and shows net + length in mm (useful for buying jumpers).
- Wiring table (bottom panel) is the same data as a table: From · Pin · To · Pin · Net · Colour · Length. Editable, sortable, CSV export.

### Persistence

- Autosave to localStorage on every change (debounced 500 ms), with a "Saved · just now" chip in the header.
- Designs and versions: Save as version (with a change note), switch version, Duplicate design, Delete, Export JSON (bundles imported meshes and user parts), Import JSON, Reset to preset.
- Share: `?design=` URL with the version compressed (lz-string) when it is under ~8 kB and uses no imported meshes; otherwise "download JSON" prompt.

### Presets

- **SARAS v1 (reference)**: the complete correct build.
- **SARAS v1 — first attempts**: the shared power bank, one motor pair reversed, 85 mm wheels. Used in the tutorial to show the checker catching real mistakes.
- **Empty chassis**.
- **SARAS 2.0 scaffold** (later): bigger chassis, placeholder for a more powerful compute board.

### Animation spec

Every animation maps to a state change. Durations are for the default setting; with `prefers-reduced-motion` the fallback column applies.

| Trigger | Animation | Timing | Reduced-motion fallback |
|---|---|---|---|
| Idle on Lab home or a part detail | slow auto-orbit (≈ 6°/s); stops on first interaction, resumes after 20 s idle | continuous | static, no auto-orbit |
| Drag / touch / keyboard orbit | damped orbit, pan and zoom; inertia on release | damping 0.08 | no inertia |
| View preset (Iso / Top / Front / Side) or double-click a part | camera **flies** to the target (position + look-at tween), part framed with padding | 600 ms, ease-in-out | instant cut |
| Explode slider / toggle | tiers lift apart vertically, parts lift off their plates (0–40 mm), wires stretch with them | 400 ms per toggle; slider is direct | instant |
| **Play (assembly)** | parts fly in from above in tutorial order, tier by tier, with a soft settle; wires draw after their parts land; scrubber and step buttons | 350 ms per part, 120 ms stagger, pause at tier ends | step-through, no motion |
| Hover a part | lifts 1.5 mm, label fades in, pins show as dots | 150 ms | label only |
| Select a part | selective outline in `--accent`, inspector slides in | 150 ms | outline only |
| Drop a part (place / snap) | small drop from 8 mm with one soft bounce; snap target flashes a magnet ring | 250 ms | instant placement |
| Move / rotate with gizmo | live; ghost of the original position stays faint until release | — | — |
| Wire two pins | tube draws from A to B along its arc; net colour fades in; both pins pulse once | 300 ms | instant |
| Hover a wire | whole net brightens; length label | 120 ms | — |
| **Check** finds a fail | failing parts/wires pulse red twice, then hold a red outline; camera does not move unless you click the finding (then it flies) | 2 × 400 ms | static red outline |
| Check passes | olive tick ripple over the robot once | 500 ms | tick icon only |
| **Test: boot** | rails light up in order; the 3D display's screen texture plays the boot log, then the idle face | ≈ 3 s sequence | checklist only |
| Test: drive | wheels rotate at the commanded speed and direction; chassis translates/turns on the floor; subtle body tilt on acceleration | real-time | real-time, no tilt |
| Test: sensors | each ultrasonic sensor shows a translucent 15° cone; a ping ripple travels out and back at the measured distance; readout updates | ping every 100 ms | cone + number only |
| Test: power | meter needles move; if a rail exceeds its supply, the Pi's status LED and the face flicker (brownout) | real-time | number turns red |
| Face states | display screen texture animates idle → listening (blink) → thinking → talking, driven by Test events or a manual picker | per state | static face |
| Route change | 3D canvas persists; new page's viewports fade in | 150 ms | instant |

Implementation notes: all tweens are interruptible springs (`@react-spring/three`); the assembly animation is a timeline over the design's placements and wires; screen textures are a `CanvasTexture` updated from a small 2D face renderer that will later be reused by the real robot's face code; the sim runs in `useFrame` at a fixed step (60 Hz) with interpolation.

### 3D controls (all input methods)

| Input | Orbit | Pan | Zoom | Select | Notes |
|---|---|---|---|---|---|
| Mouse | left drag | right drag or `Shift`+left | wheel | click | double-click frames the part |
| Trackpad | one-finger drag | two-finger drag | pinch | click | |
| Touch | one finger | two fingers | pinch | tap | long-press opens the part menu |
| Keyboard | arrows | `Shift`+arrows | `+` / `−` | `Tab` cycles parts | `F` frames selection, `Home` resets view |
| Gamepad | right stick | left stick | triggers | `A` | same gamepad drives the robot in Test |

### Chassis designer and importing our own models

- The parametric chassis is a generator: `chassisParams → meshes` (plates with rounded corners and standoff holes on a 5 mm grid, motor mounts with configurable outboard offset, wheel cut-outs, neck blocks for the head). Changing a slider regenerates in under 16 ms for the default size.
- Imported STL / GLB / OBJ files are parsed in a Web Worker, normalised (units, centre, up-axis), simplified if over 300 k triangles (with a warning), and stored in IndexedDB. The design references them by id; exporting a design bundles them.
- Imported meshes participate in snapping (face detection for flat mounting surfaces), overlap checks (MECH-001), and wheel clearance (MECH-002).
- Mixed mode is allowed: an imported base plate with parametric upper tiers.

### Designs, versions and compare

- A **design** is a named line of **versions**; each version is a full `Build` document plus a change note. Saving creates a new version only when you say so (Save as version); autosave updates the working copy.
- Branching is just "duplicate design from version N".
- **Compare** renders both versions in two synced viewports (one `CameraControls`, two `View`s) and computes a structural diff: placements by `instanceId` (added, removed, moved > 1 mm, rotated), connections by endpoints, chassis params, totals (mass, cost, rail budgets) and check results. Overlay mode renders B as a translucent ghost on A.

### Lab notebook

- Entries: `{ id, designId, versionId, type: 'test' | 'note' | 'photo' | 'checkpoint', createdAt, markdown?, report?, photos?: blobIds[] }`.
- Test mode writes an entry automatically with the test report attached; checkpoints from the tutorial write one when passed.
- Photos are stored in IndexedDB and shown in a lightbox next to the 3D state they were taken against, so the real build and the virtual one can be compared frame by frame.

### Performance

- Instanced pin markers; wires share one material per net colour; procedural geometries cached by `componentId`; imported meshes get a simplified collision proxy.
- Target 60 fps with 40 parts and 80 wires on an integrated GPU; degrade shadows, then AO, then outline first. A quality setting (Low / Medium / High) is remembered per device.
- GLB models lazy-loaded and Draco-compressed; procedural fallback shows immediately.

## 11. Check and Test engine

### Check: rules

Each rule is a pure function with an id, severity, message template, fix hint and a tutorial link. Rules run on every change (debounced) and on demand. Results group by severity; clicking one highlights its subjects in 3D.

| ID | Severity | Rule | From the real build? |
|---|---|---|---|
| PWR-001 | fail | Brain (Pi) has no 5 V supply connected. | |
| PWR-002 | fail | Pin receives a voltage outside its tolerated range (e.g., 7.4 V into a Pi 5 V pin; 5 V into a 3.3 V GPIO). | |
| PWR-003 | warn/fail | Rail's worst-case draw exceeds supply rating (warn > 90 %, fail > 120 %). | |
| PWR-004 | fail | One power source feeds both the compute rail and the motor rail. Explains the single-port-under-load behaviour and the LiPo + UBEC path. | **Yes** |
| PWR-005 | fail | Motor driver and Pi share no ground. | |
| PWR-006 | warn | Pi powered from the L298N's onboard 5 V regulator (≤ 0.5 A, browns out). | |
| PWR-007 | info | Buck converter in the path: check its continuous current rating against the rail's worst case. | Yes (the buck attempt) |
| MOT-001 | fail | Motors on the same channel are wired with opposite polarity: they cancel out. | **Yes** |
| MOT-002 | warn | Left/right motor pairs are swapped relative to the chassis orientation (robot turns the wrong way). | Yes (polarity/direction) |
| MOT-003 | warn | ENA/ENB jumper left on while a PWM pin is also wired: speed control will not work. | |
| MOT-004 | warn | Wheel diameter > 75 mm on a TT motor: torque at the tread drops; turning on carpet or rubber may fail. Suggests smaller wheels, tape on the tread, or higher-torque motors. | **Yes** |
| MOT-005 | warn | Two motors in parallel on one channel: combined stall current exceeds the channel rating. | |
| MOT-006 | fail | Motor terminal left unconnected. | |
| GPIO-001 | fail | Same GPIO used for two signals. | |
| GPIO-002 | fail | 5 V output (HC-SR04 ECHO) connected to a Pi GPIO without a divider or level shifter. | |
| GPIO-003 | warn | Reserved pins used (GPIO0/1 ID EEPROM; GPIO14/15 if serial console on). | |
| GPIO-004 | info | ENA/ENB not on a hardware-PWM-capable pin (12, 13, 18, 19): software PWM will be used. | |
| SEN-001 | fail | Ultrasonic sensor missing TRIG or ECHO or VCC/GND. | |
| SEN-002 | warn | Sensor's field of view (≈ 15° cone) is blocked by another part or points into the chassis. | |
| CAM-001 | fail | Camera not connected to CSI. | |
| CAM-002 | info | Camera `rotation` setting is 180°: remember `--rotation 180` / `transform` in software. | Yes (upside down) |
| DSP-001 | warn | Display connected to HDMI but its 5 V draw isn't on any rail. | |
| USB-001 | fail | More USB devices than the Pi has ports (hub needed). | |
| MECH-001 | fail | Two parts' bodies overlap. | |
| MECH-002 | fail | Wheel radius intersects the chassis plate: increase motor outboard offset (standoffs) or use smaller wheels. | **Yes** |
| MECH-003 | warn | Centre of mass is outside the wheelbase or above a tip-over threshold (computed from `massG` and positions). | |
| MECH-004 | info | Battery bay has no retention: parts may slide (suggest standoffs/brackets). | Yes |
| BUILD-001 | pass/fail | Build completeness: brain, driver, ≥ 2 drive motors, a power source per rail, GND network. | |
| BUILD-002 | info | Optional roles missing (face, see, hear, speak, sense) with what each unlocks in the tutorial. | |

Rules are data-driven where possible (voltages and currents come from the catalog), so a user-added part is covered by every power and pin rule with no code changes.

### Test: simulation modes

A deterministic, kinematic simulation that reads the same `Build`.

1. **Boot checklist** — animates: power on rails → Pi boots (display shows the "boot log" then the idle face) → camera detected → mic/speaker enumerated on USB → motor driver enabled. Each item passes or fails from the wiring; failures link back to rules.
2. **Drive test** — arrow keys / WASD / on-screen D-pad / gamepad (matches the Xbox-controller manual mode). The sim resolves which driver channel each key energises, follows the wires to each motor, applies polarity, and animates the wheels and chassis on the floor. Wrong polarity shows the exact wrong behaviour (spinning in place, going backwards), which is the point.
3. **Sensor test** — place virtual obstacles (boxes, a "couch") on the floor. Ultrasonic sensors cast rays within their cone; a live panel shows the three distances in cm with the ≈ 2 cm–400 cm range and 15° cone enforced. "Stop before the boxes" demo: drive forward, watch the front reading, auto-stop at a configurable threshold.
4. **Power meter** — live typical/worst current per rail from the active state (motors drawing more while stalled against an obstacle); a brownout flash on the Pi face if the 5 V rail exceeds its supply.
5. **Test report** — one click produces a markdown/JSON report: build name, assumptions, all rule results, drive/sensor/power observations, and a checklist for the real-world first boot.
6. **Code export** — generates a `saras_config.py` with the pin map from the build (BCM numbers, PWM pins, sensor trios, camera rotation), plus a `wiring.csv` and `bom.csv`. This is the bridge into the software tutorial.

### Regression tests "from reality"

The engine's test suite includes the *first attempts* preset and asserts: `PWR-004` fail, `MOT-001` fail, `MOT-004` warn, `MECH-002` fail with stock motor offset. The reference preset must produce zero fails and only the two known power warnings.

## 12. Hardware library: adding your own parts

### `/parts/new` form

Sections, each saving to the `Component` schema:

1. **Basics** — name, category, role, tags, short description, image URL (optional), purchase URL, price USD/INR.
2. **Body** — shape (box / cylinder / PCB / wheel / GLB upload), size w×d×h mm, colour, mass g, mount holes (click on a top-down outline to add), optional GLB file (stored in IndexedDB for user parts).
3. **Power** — needs: voltage min/max, typical A, max A. Provides: voltage, max A, capacity Wh (batteries).
4. **Pins** — editable table: id, label, kind (dropdown), voltage, max A, position (click on the outline), group, notes. Templates: "40-pin Pi header", "screw terminal ×N", "2-wire motor", "HC-SR04 style 4-pin", "USB device", "I2C 4-pin".
5. **Gotchas** — free-text bullets shown in the detail page and in rule explanations.
6. **Review** — JSON preview (validated live with Zod; errors inline), **Save to My parts**, **Export JSON**, **Propose to catalog**.

"Propose to catalog" opens a prefilled GitHub issue (or PR via a link to a new file under `src/catalog/parts/`) with the JSON in the body. No backend needed.

### Storage and sharing

- User parts live in localStorage (`saras.parts.v1`) and are merged into the catalog at startup with `source: 'user'`.
- Import/export a `parts.json` bundle; a build JSON embeds any user parts it depends on so a shared build never references a missing part.

### Starter catalog (built-in)

Reference parts (§9) plus common swaps so "add more hardware" is useful on day one:

- Compute: Raspberry Pi 4B, Raspberry Pi 5, Raspberry Pi 3B+, Raspberry Pi Zero 2 W.
- Drivers: L298N module, TB6612FNG breakout, DRV8833 breakout, PCA9685 servo driver.
- Motion: TT gear motor, N20 micro gear motor, 65 mm wheel, 85 mm wheel, SG90 servo (for a pan-tilt head later).
- Sensing: HC-SR04, HC-SR04 with 3.3 V-tolerant variant note, VL53L0X time-of-flight, MPU6050 IMU, INA219 power monitor.
- Vision/face: Pi Camera v2, Pi Camera Module 3, 7" HDMI display, 0.96" OLED (for a tiny status face).
- Audio: USB omni mic, USB speaker, I2S mic (INMP441), I2S amp (MAX98357A).
- Power: 5 V power bank, 18650 2S holder, 2S LiPo 2200 mAh, UBEC 5 V/5 A, LM2596 buck module, 2S BMS, XT60 connector.
- Mechanical: M2.5 and M3 standoffs, 3-tier chassis plates.

## 13. Tutorial content plan

### Structure

Two tracks plus a troubleshooting index. Each step is one MDX file with front-matter:

```yaml
step: 3
track: hardware
title: Wire the motors to the L298N
time: 25 min
parts: [l298n-module, tt-motor×4, jumper-wire]
tools: [small screwdriver, wire stripper]
buildState: hw-03          # which Build snapshot the right panel shows
video: { id: IT1uBUsOmUY, from: "05:50", to: "06:46" }
checkpoint: { rules: [MOT-001, MOT-006, PWR-005], test: none }
```

Writing rules: short imperative steps; one photo or 3D state per step; a **From the real build** callout wherever the creator hit a problem; a **Checkpoint** box at the end that lists which rules must pass and opens the Workbench in that state; cite the video timestamp for provenance.

### Hardware track

| # | Step | Covers (video ref) | Checkpoint |
|---|---|---|---|
| 0 | Start here | What SARAS is, what you'll build, cost, time, safety (LiPo handling, never power the Pi from the L298N 5 V) | — |
| 1 | Design and chassis | Fusion 360 three-tier design, print or cardboard/acrylic (01:53–02:31) | Load empty chassis preset |
| 2 | Motors and wheels | Mounting, **standoff fix for tire clearance**, free spin test (04:49–05:44) | MECH-002 passes |
| 3 | Wire motors to the L298N | Pairing left/right, **polarity** (05:50–06:46) | MOT-001, MOT-006, PWR-005 |
| 4 | Tier 2 and the battery bay | Standoffs, retention for the power bank (06:46–07:13) | MECH-004 |
| 5 | Mount the Raspberry Pi | Standoffs, orientation for cable access (07:13–07:34) | MECH-001 |
| 6 | Power: what failed and what works | Dual-output bank, buck attempt, split supplies, LiPo + UBEC path (07:34–08:54) | PWR-001…PWR-007 |
| 7 | Pi ↔ L298N and the first drive | GPIO wiring, pin map, keyboard test script (08:54–09:49) | GPIO-001, MOT-003, Drive test |
| 8 | The turning problem | Torque vs friction, **tape fix** (09:49–10:59) | MOT-004 |
| 9 | Build the head | Speaker blocks as neck, display mount, camera (**not upside down**), mic, speaker (11:00–12:17) | CAM-001, CAM-002, USB-001, DSP-001 |
| 10 | Ultrasonic sensors | Front/left/right placement, **ECHO divider**, cone of view (12:17–12:36) | SEN-001, SEN-002, GPIO-002, Sensor test |
| 11 | First boot | Power order, boot log, display, quick spin (12:36–13:01) | Boot checklist, Test report |
| 12 | Upgrade paths | Single LiPo rail, TB6612FNG, Pi 5, SARAS 2.0 notes | — |

### Software track

Based on the overview video and standard open-source tooling; marked "reconstructed" until the creator's software video is out, then revised.

| # | Step | Covers |
|---|---|---|
| 1 | Raspberry Pi OS and Python setup | 64-bit OS, venv, enabling camera and audio, `gpiozero`/`lgpio` (Pi 5 note) |
| 2 | Motor control | `saras_config.py` from the Workbench export, forward/back/left/right/stop, PWM speed, safe shutdown |
| 3 | Manual mode | Xbox controller via `pygame`/`evdev`, dead zones, kill switch |
| 4 | Face on the display | `pygame` fullscreen states: idle, listening (blink), thinking, talking |
| 5 | Wake word and speech-to-text | openWakeWord or Porcupine for "Hey SARAS"; Whisper (faster-whisper) or Vosk |
| 6 | The brain | Routing text to a local Llama via Ollama or to the OpenAI API; a 20-word reply constraint; intent routing (chat / move / look / go-to / explore) |
| 7 | Text-to-speech | Piper locally; fallback cloud TTS |
| 8 | Vision | Capture with `picamera2`; LLaVA via Ollama for "what do you see" |
| 9 | Go to an object | Look → describe → steer loop; front ultrasonic stop threshold |
| 10 | Autonomous exploration | Step/decide loop; obstacle reads; move log; feeding history into the prompt; mission report |
| 11 | Logs and a map | Run-by-run logs, replaying them, towards a 2D map |
| 12 | Going fully offline | Model sizes vs Pi RAM, when a bigger board is warranted (SARAS 2.0) |

### Troubleshooting index

Symptom → likely cause → rule → step. Seeded with the video's problems: robot won't turn; motors fight; Pi reboots when motors start; camera image upside down; power bank shuts off; wheels rub the chassis; USB mic not detected; ultrasonic reads 0 or max.

## 14. Repository structure

```
/
├─ PLAN.md                      this document
├─ README.md
├─ package.json · vite.config.ts · tsconfig.json · tailwind.config.ts
├─ public/
│  ├─ models/                   GLB files (later), Draco-compressed
│  ├─ images/                   tutorial photos, part images
│  └─ favicon.svg
├─ src/
│  ├─ main.tsx · app/           router, RootLayout, Header, Footer, CommandPalette
│  ├─ design/                   tokens.css, ui/ (Button, Card, Badge, Table, Tabs, Drawer, Callout, …)
│  ├─ catalog/
│  │  ├─ schema.ts              Zod schemas → TS types
│  │  ├─ parts/*.json           built-in parts, one file each
│  │  ├─ index.ts               load, validate, merge user parts
│  │  └─ templates.ts           pin templates for the add-part form
│  ├─ design/                   Design + version schema, store (zustand + persist + temporal), presets/*.json, diff, share codec
│  ├─ chassis/                  parametric generator, STL/OBJ/GLTF import worker, mesh normalisation
│  ├─ notebook/                 entries store, photo storage (idb-keyval), markdown export
│  ├─ compare/                  synced viewports, structural diff table, overlay mode
│  ├─ workbench/
│  │  ├─ Workbench.tsx          layout: drawer · viewport · inspector · bottom panel
│  │  ├─ canvas/                persistent Canvas + View tiling, CameraControls, quality settings
│  │  ├─ scene/                 Scene, Chassis, PartBody, PinMarkers, Wire, Floor, Gizmos, ScreenFace (CanvasTexture)
│  │  ├─ animation/             springs, camera flights, explode, assembly timeline, check pulses
│  │  ├─ tools/                 select, move, rotate, wire, measure, snapping
│  │  └─ panels/                PartsDrawer, Inspector, WiringTable, ChecksPanel, TestConsole, BomPanel
│  ├─ engine/
│  │  ├─ nets.ts                union-find net derivation
│  │  ├─ rules/*.ts             one rule per file + index
│  │  ├─ power.ts               rail budgets
│  │  ├─ geometry.ts            overlap, clearance, centre of mass, FOV cones
│  │  ├─ sim/                   boot, drive, sensors, power meter
│  │  └─ export/                report.md, saras_config.py, wiring.csv, bom.csv
│  ├─ pages/                    Lab, Workbench, Designs, Compare, Chassis, Notebook, Parts, PartDetail, AddPart, Tutorial*, Cost, Docs, About
│  ├─ tutorial/
│  │  ├─ content/hardware/*.mdx · content/software/*.mdx · troubleshooting.mdx
│  │  └─ components/            Step, Checkpoint, FromTheBuild, PinTable, WorkbenchState
│  └─ shared/                   types, units, currency, hooks
├─ tests/
│  ├─ unit/                     engine, schema, store (vitest)
│  └─ e2e/                      playwright: smoke per page, workbench flows, visual snapshots
└─ .github/workflows/           ci.yml (lint, typecheck, unit, e2e), pages.yml (build + deploy)
```

## 15. Roadmap and milestones

Each milestone ships to the live site. "Done" means the acceptance list passes and the CI is green.

3D comes first: the very first thing on the live site is SARAS, rotatable and animated. Editing, checking and testing follow; the tutorial comes after the lab works, because the lab is what we use day to day.

| Milestone | Scope | Acceptance |
|---|---|---|
| **M0 Plan** | This document | Reviewed by you; open decisions answered. |
| **M1 Foundation + 3D core** | Vite/React/TS scaffold, tokens + Tailwind theme, Header/Footer, routing, CI + deploy; **persistent canvas**, parametric chassis generator, procedural part bodies, the SARAS v1 reference design rendered in 3D; damped orbit/pan/zoom on mouse, trackpad, touch and keyboard; auto-orbit idle; camera flights to Iso/Top/Front/Side; explode slider; hover labels; Lab home with the live viewport | Open the site and spin SARAS at 60 fps on a laptop and on a phone; explode and view flights animate; beige theme and header on every page; Lighthouse ≥ 90. |
| **M2 Workbench editing + designs** | Parts drawer, add / move / rotate / snap with drop animation, inspector, undo/redo, autosave, designs and versions, import/export JSON; **chassis designer** sliders; **STL / GLB / OBJ import** | Place a part in < 3 clicks and watch it land; change wheel size with a slider and see the chassis rebuild; import a Fusion 360 STL and mount a Pi on it; reload restores everything. |
| **M3 Catalog + Parts + Cost** | Zod schema; 25+ built-in parts; `/parts` with live 3D cards, filters, compare; `/parts/:id` large 3D preview; `/cost/:designId` with USD/INR, toggles, CSV | Every part validates; cards spin on hover; cost page reproduces the ≈ $150 total. |
| **M4 Wiring + Check** | Pin markers, wire tool with draw animation, wiring table, nets, rule engine with all §11 rules, Checks panel with 3D pulse/highlight and camera-fly-to-finding | Reference design: 0 fails; first-attempts design: the four regression findings; fix MOT-001 by rewiring and watch it clear. |
| **M5 Test + animation** | Boot sequence with the screen face texture, drive test (keys + gamepad) with spinning wheels and floor motion, sensor cones and pings with obstacles, power meters and brownout, **Play assembly animation** with scrubber, test report, `saras_config.py` / CSV export | Reversed polarity visibly misbehaves; the front sensor stops the robot before a box; Play assembles SARAS tier by tier; exported config matches the wiring table. |
| **M6 Compare + Notebook** | `/designs` timeline, `/designs/compare` synced viewports + diff + overlay, `/notebook` with auto test entries, notes, photos, markdown export | Duplicate SARAS v1 to a LiPo version, compare them, and the diff lists the swapped parts and the power change; a test run appears in the notebook with its report. |
| **M7 Tutorial** | All hardware steps, all software steps (reconstructed), troubleshooting, step ↔ 3D state sync, video timestamp links, progress bar, checkpoints writing notebook entries | Every hardware step shows the right 3D state beside it; checkpoints pass on the reference design. |
| **M8 Add-a-part + polish** | `/parts/new` form, pin templates, user parts storage, GLB models for the 8 core parts (Draco), command palette, PWA offline, a11y audit, visual snapshot tests, quality settings for low-end GPUs | Add an unknown sensor in < 5 min and get rule coverage; offline reload works; axe has zero serious issues. |
| **M9 Stretch** | SARAS 2.0 design track, chassis STL export, dark "night bench" theme, AR preview via `<model-viewer>`, optional password gate if we ever host it publicly | — |

Order of work sessions: M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8. M2 before M3 so we can build and test with the reference parts before the full catalog exists; the drawer in M2 starts with the SARAS parts only.

## 16. Quality bar

- **Unit tests** for every rule (positive and negative case), net derivation, power budgets, geometry helpers, schema, build store (undo/redo, migrations), exporters.
- **E2E** smoke for every route; Workbench flows: add part, wire two pins, run check, run drive test, export; visual snapshots for Home, Parts, a tutorial step, and the Workbench at the reference preset.
- **Performance budgets**: initial JS ≤ 250 kB gzip excluding the three.js chunk; the three.js chunk loads once and the canvas persists across routes; LCP < 2.5 s; 60 fps in the Workbench with the reference design on an integrated GPU, 30 fps minimum on a mid-range phone with the quality setting on Low.
- **Animation**: every tween ≤ 600 ms except Play; no layout jank during camera flights; `prefers-reduced-motion` honoured everywhere in §10's table; an in-app "Reduce motion" toggle too.
- **Accessibility**: WCAG 2.2 AA; full keyboard path for everything the 3D does; captions for any embedded video; reduced-motion respected.
- **Browsers**: last 2 versions of Chrome, Edge, Firefox, Safari; iPadOS Safari for the Workbench in view-only + list mode.
- **Content review**: every electrical claim in the tutorial carries a source (datasheet or video timestamp) in a footnote; assumed values are visibly tagged.

## 17. Deployment

- GitHub Actions: `ci.yml` on PR (lint, typecheck, unit, e2e headless); `pages.yml` on push to `main` (build → upload artifact → deploy to GitHub Pages).
- Vite `base` set from the repo name for Pages; a `404.html` SPA redirect.
- Vercel is a drop-in alternative if a custom domain and preview deployments per PR are wanted (see §19).

## 18. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Component dimensions or pinouts wrong | Wrong fits, wrong wires, lost trust | Appendix A values marked nominal; each part links to its datasheet; the UI shows "verify against your board" on `assumed` values; community corrections via propose-to-catalog. |
| Electrical advice causing damage (LiPo, 5 V into GPIO) | Safety | Rules are conservative; LiPo safety callout at step 0 and step 6; never suggest powering the Pi from the L298N 5 V. |
| 3D model licensing | Legal | Procedural bodies by default; only CC0/CC-BY GLBs with attribution in `/about`. |
| 3D performance on low-end laptops | Unusable Workbench | Procedural low-poly, instancing, lazy GLBs, quality toggle, list-based fallback. |
| Scope creep in the sim | Never ships | Kinematic only; rules over physics; sim modes are fixed at the five listed. |
| Software track drifts from the creator's eventual video | Confusion | Labelled "reconstructed"; revised when the video ships; code kept library-agnostic where possible. |
| Price drift | Misleading cost | Prices editable, dated, and regional presets. |

## 19. Decisions needed from you

Defaults are in bold; say nothing and we proceed with them.

1. **Stack**: **Vite + React + TypeScript + React Three Fiber** as in §7, or do you prefer something else?
2. **Hosting**: it's personal, so: **GitHub Pages on an unlisted URL** (simplest), Vercel with password protection, or local-only (`npm run dev`)? We can start on Pages and add a gate later.
3. **Name**: **"SARAS Lab"**, or "SARAS Builder", "Hardware Lab", something else?
4. **Pi model you actually have**: **Pi 4 Model B** assumed. Pi 5 changes the GPIO library and the power rule thresholds.
5. **Chassis files**: do you have (or can you get) the creator's Fusion 360 / STL files? If not, the parametric placeholder stays and we add a "print your own" note.
6. **Wheel size** you plan to use: **85 mm** assumed.
7. **Currency default**: **show both USD and INR**, INR first for India visitors (by browser locale)?
8. **Moving between machines**: **JSON export/import** (designs bundle their imported meshes and user parts), or do you want the repo itself to store designs (commit a `designs/*.json` folder so git is the sync)?
9. **Videos**: **embed the YouTube players** at the cited timestamps, or link out only?
10. **Licensing**: code **MIT**; tutorial text **CC BY-SA 4.0** with credit to Tech With Anant. OK?
11. **Your chassis files**: if you already have STL / Fusion exports of a design you want to test, the importer in M2 is built around them. Which format do you export (STL, 3MF, STEP → GLB)?
12. **Devices**: **desktop first, phone for viewing** assumed. If you want full editing on a tablet, M2 gets a touch-first pass.

---

## Appendix A — Component dimension and power reference

Nominal values for the procedural 3D bodies and power rules. Verify against the datasheet of the exact unit you own; values marked ≈ vary by vendor.

| Part | Size (w × d × h, mm) | Mass (g) | Power | Interface / pins | Notes |
|---|---|---|---|---|---|
| Raspberry Pi 4 Model B | 85 × 56 × 17 | ≈ 46 | 5 V, 1.2 A typ, 3 A supply recommended | 40-pin header, 2× USB 2.0, 2× USB 3.0, 2× micro-HDMI, CSI, USB-C power | 3.3 V logic on GPIO |
| Raspberry Pi 5 | 85 × 56 × 18 | ≈ 46 | 5 V, up to 5 A supply recommended | as above; uses `lgpio`/`gpiozero` | |
| L298N module | 43 × 43 × 27 | ≈ 26 | VS 5–35 V; 2 A/channel; ≈ 2 V drop; 5 V reg 0.5 A | VS, GND, +5V, ENA, IN1–IN4, ENB, OUT1–OUT4 | 5 V-EN jumper; remove ENA/ENB jumpers for PWM |
| TT DC gear motor (1:48) | ≈ 70 × 22 × 18 incl. gearbox | ≈ 30 | 3–6 V; ≈ 0.15–0.25 A no load; ≈ 1–1.5 A stall at 6 V | 2 terminals | Shaft Ø 5.4 mm D |
| Wheel, stock | Ø 65 × 26 | ≈ 30 | — | TT D-shaft | |
| Wheel, swapped | Ø 85 × 30 (assumed) | ≈ 45 | — | TT D-shaft | triggers MOT-004 |
| 7" HDMI display 1024×600 | ≈ 165 × 107 × 15 (bare PCB variants ≈ 165 × 124) | ≈ 200 | 5 V, 0.5–1 A | HDMI, micro-USB power/touch | |
| Pi Camera Module v2 | 25 × 24 × 9 | 3 | via CSI | 15-pin ribbon | rotation setting |
| HC-SR04 | 45 × 20 × 15 | 8.5 | 5 V, 15 mA | VCC, TRIG, ECHO, GND | ECHO is 5 V; 15° cone; 2–400 cm |
| USB omnidirectional mic (puck) | ≈ Ø 60 × 25 | ≈ 60 | USB bus | USB-A | varies |
| USB speaker (mini bar) | ≈ 180 × 45 × 45 | ≈ 200 | USB 5 V, 0.1–0.5 A | USB-A (+3.5 mm on some) | varies |
| 5 V power bank 10 000 mAh | ≈ 140 × 68 × 15 | ≈ 200 | 5 V, 2.4–3 A per port | USB-A/USB-C | single-port-under-load behaviour common |
| 18650 cell | Ø 18 × 65 | ≈ 45 | 3.7 V nom, 2–3 A cont. typical | — | 2S holder ≈ 78 × 40 × 20 |
| 2S LiPo 2200 mAh | ≈ 105 × 34 × 16 | ≈ 120 | 7.4 V nom, high discharge | XT60/JST | needs a LiPo-safe charger and a low-voltage alarm |
| UBEC 5 V / 5 A | ≈ 45 × 20 × 10 | ≈ 15 | in 6–23 V → out 5 V 5 A | — | the clean way to feed a Pi from the LiPo |
| LM2596 buck module | 43 × 21 × 14 | ≈ 12 | in 4–35 V → out 1.25–30 V, ≈ 2 A real-world | — | likely why the buck attempt starved both loads |
| Standoff M2.5 ×11 | — | — | — | — | Pi mount holes are M2.5 at 58 × 49 mm |

## Appendix B — Default GPIO pin map

BCM numbering. Chosen to avoid I2C (2/3), SPI (7–11), UART (14/15) and ID EEPROM (0/1) so those stay free for upgrades.

| Function | BCM | Header pin | Note |
|---|---|---|---|
| L298N IN1 (left A) | GPIO17 | 11 | |
| L298N IN2 (left B) | GPIO27 | 13 | |
| L298N IN3 (right A) | GPIO22 | 15 | |
| L298N IN4 (right B) | GPIO23 | 16 | |
| L298N ENA (left speed) | GPIO18 | 12 | hardware PWM0 |
| L298N ENB (right speed) | GPIO13 | 33 | hardware PWM1 |
| HC-SR04 front TRIG / ECHO | GPIO5 / GPIO6 | 29 / 31 | ECHO via divider |
| HC-SR04 left TRIG / ECHO | GPIO24 / GPIO25 | 18 / 22 | ECHO via divider |
| HC-SR04 right TRIG / ECHO | GPIO16 / GPIO26 | 36 / 37 | ECHO via divider |
| 5 V to sensors | 5V | 2 / 4 | |
| Ground (common with L298N) | GND | 6, 9, 14, 20, 25, 30, 34, 39 | at least one to the L298N GND |
| Camera | CSI | — | ribbon |
| Display | micro-HDMI 0 | — | |
| Mic, speaker | USB | — | |
| Reserved for later | GPIO2/3 (I2C), GPIO14/15 (UART), GPIO12/19 (PWM alt) | | INA219, OLED, IMU |

Exported by the Workbench as `saras_config.py`:

```python
# generated by SARAS Lab from build "SARAS v1 (reference)"
PI_MODEL = "Pi 4 Model B"           # assumed
LEFT  = dict(in1=17, in2=27, en=18)  # BCM
RIGHT = dict(in1=22, in2=23, en=13)
ULTRASONIC = {
    "front": dict(trig=5,  echo=6),
    "left":  dict(trig=24, echo=25),
    "right": dict(trig=16, echo=26),
}
CAMERA_ROTATION = 0                  # set 180 if mounted upside down
WHEEL_DIAMETER_MM = 85
```

## Appendix C — Glossary

- **BOM** — bill of materials; the priced parts list.
- **BCM** — Broadcom GPIO numbering used by Raspberry Pi libraries (as opposed to physical header pin numbers).
- **H-bridge** — the circuit inside the L298N that lets a motor run in either direction.
- **Net** — a set of pins that are electrically connected (e.g., everything on GND).
- **PWM** — pulse-width modulation; how ENA/ENB set motor speed.
- **Rail** — a power net at one voltage (5 V rail, 7.4 V motor rail).
- **UBEC** — a small switching regulator (battery eliminator circuit) that makes a clean 5 V from a LiPo.
- **CSI** — the Pi's camera ribbon connector.
- **Tier** — one of the three stacked plates of the SARAS chassis.
