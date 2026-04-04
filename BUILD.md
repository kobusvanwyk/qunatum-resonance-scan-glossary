# Building the QRS Glossary Desktop App

## Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- Windows machine (or Windows cross-compile environment) for the `.exe` build

## Setup (first time only)
```bash
npm install
```

## Run in development
```bash
npm start
```
Opens the app in an Electron window — no install needed.

## Build the Windows installer
```bash
npm run dist
```
This produces `dist/QRS Glossary Setup 1.0.0.exe` — a standard NSIS installer
that lets the user choose an install directory and creates Desktop + Start Menu shortcuts.

## Installer behaviour
- One-click option: **off** — user picks the install folder
- Desktop shortcut: ✅
- Start Menu shortcut: ✅
- Uninstaller: ✅ (via Windows Add/Remove Programs)

## Updating the app
1. Edit `index.html` as normal
2. Bump `"version"` in `package.json`
3. Run `npm run dist` again
