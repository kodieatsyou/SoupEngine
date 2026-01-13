# SoupEngine

A terminal-based 3D ASCII rendering engine written in JavaScript using Node.js.  
SoupEngine renders simple 3D meshes (such as a tetrahedron) directly to the terminal using ANSI escape codes and supports real-time keyboard interaction.

This project is an experimental software renderer focused on learning:
- 3D math (vectors, matrices, transformations)
- Rasterization concepts
- Terminal-based rendering
- Engine-style architecture in JavaScript

---

## Features

- Real-time rotation using keyboard input
- Terminal framebuffer with ANSI color rendering
- Simple world + screen abstraction
- Zero external rendering libraries

---

## Demo Behavior

When you run the project, a colored tetrahedron is drawn in your terminal.  
You can rotate it in real time using the keyboard:

| Key | Action |
|------|--------|
| W | Rotate roll negative |
| S | Rotate roll positive |
| A | Rotate pitch positive |
| D | Rotate pitch negative |
| Q | Rotate yaw positive |
| E | Rotate yaw negative |
| 0 | Exit program |

---

## Requirements

- Node.js 18 or newer (tested on Node 22)
- A terminal that supports ANSI escape codes (macOS Terminal, iTerm2, Linux terminals, Windows Terminal)

## Installation
- Clone the repo:
```bash
git clone https://github.com/kodieatsyou/SoupEngine.git
cd SoupEngine
```
- Install dependencies:
```bash
npm install
```

## Running the Engine
- From the project root:
```bash
node bin/index.js
```
- Or using npm:
```bash
npm start
```
