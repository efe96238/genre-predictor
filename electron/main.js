import { app, BrowserWindow, ipcMain, shell } from "electron"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { spawn } from "node:child_process"
import fs from "node:fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"]
const isDev = !!VITE_DEV_SERVER_URL

/*"files": [ 
      "dist/**",
      "dist-electron/**"
    ], these lines saved me from a mental breakdown, put this in package.json */

process.env.APP_ROOT = isDev
  ? path.join(__dirname, "..")
  : app.getAppPath()

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron")
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist")

process.env.VITE_PUBLIC = isDev
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST

let win
let backendProc

ipcMain.handle("window:minimize", (event) => {
  const w = BrowserWindow.fromWebContents(event.sender)
  w?.minimize()
})

function startBackend() {
  const exePath = app.isPackaged
    ? path.join(process.resourcesPath, "backend", "genre_backend.exe")
    : path.join(process.env.APP_ROOT, "backend", "dist", "genre_backend.exe")

  if (!fs.existsSync(exePath)) {
    console.error("Backend exe missing:", exePath)
    return
  }

  backendProc = spawn(exePath, [], { stdio: "ignore", windowsHide: true })
}

function stopBackend() {
  if (backendProc) backendProc.kill()
  backendProc = null
}

app.on("before-quit", stopBackend)

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    icon: path.join(process.env.VITE_PUBLIC, 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })
  win.setMenuBarVisibility(false);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  startBackend()
  createWindow()
})
