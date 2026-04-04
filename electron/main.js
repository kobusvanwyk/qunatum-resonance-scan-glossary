const { app, BrowserWindow, shell, nativeImage, Menu } = require('electron')
const path = require('path')

// Set app identity early — controls taskbar icon & grouping on Windows
app.setAppUserModelId('com.quantumresonance.glossary')

// Remove the native menu bar entirely (File, Edit, View, Window, Help)
Menu.setApplicationMenu(null)

const iconPath = path.join(__dirname, 'icon.ico')
const appIcon  = nativeImage.createFromPath(iconPath)

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 800,
    minHeight: 600,
    title: 'QRS Glossary',
    icon: appIcon,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false  // wait until ready-to-show to avoid white flash
  })

  win.loadFile(path.join(__dirname, '..', 'index.html'))

  // Open maximised on first load
  win.once('ready-to-show', () => {
    win.maximize()
    win.show()
  })

  // Open external links in the system browser, not in the app
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
