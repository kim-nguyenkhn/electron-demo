'use strict'

import { app, BrowserWindow, dialog, globalShortcut, shell, ipcRenderer } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const options = {
    width: 400,
    height: 225,
    
    // transparent: true
    // frame: false

  }
  const window = new BrowserWindow(options)

  if (isDevelopment) {
    // window.webContents.openDevTools()
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
  
  // Shortcut listener
  globalShortcut.register('CommandOrControl+K', () => {
    
    // NOTE: Show dialog message boxes
    dialog.showMessageBox({
      type: 'info',
      message: 'Success!',
      detail: 'You presesd the registered global shortcut keybinding :D',
      buttons: ['OK']
    })
    
    // NOTE: Open external links
    // shell.openExternal('https://github.paypal.com')

    // NOTE: Create a new HTML5 Notification (only available in HTML5 renderer process)
    // const options = {
    //   title: 'Basic Notification',
    //   body: 'Short message part'
    // }
    // const notification = new window.Notification(options.title, options)
    // notification.onclick = () => {
    //   console.log('Notification clicked')
    // }

    // NOTE: Open a file or directory using ipcRenderer
    // ipcRenderer.send('open-file-dialog')
    // ipcRenderer.on('selected-directory', (event, path) => {
    //   document.body.innerHTML = `You selected: ${path}`
    // })
  })
    
})
