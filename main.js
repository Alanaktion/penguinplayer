const { app, BrowserWindow, BrowserView, Menu } = require('electron')
const path = require('path')
const fs = require('fs')

let pluginPath
try {
    pluginPath = app.getPath('pepperFlashSystemPlugin')
} catch (e) {
    let pluginName
    switch (process.platform) {
        case 'win32':
            pluginName = 'pepflashplayer.dll'
            break
        case 'darwin':
            pluginName = 'PepperFlashPlayer.plugin'
            break
        case 'linux':
            pluginName = 'libpepflashplayer.so'
            break
    }
    pluginPath = path.join(__dirname, 'plugins', pluginName)
}

app.commandLine.appendSwitch('ppapi-flash-path', pluginPath)

app.on('ready', () => {
    let width = 1280
    let height = 820

    Menu.setApplicationMenu(null);

    let win = new BrowserWindow({ width, height })

    let view = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            plugins: true,
        },
    })
    win.setBrowserView(view)
    view.setBounds({ x: 0, y: 0, width, height })
    view.setAutoResize({ width: true, height: true })
    view.webContents.loadURL('https://play.cprewritten.net/')

    let css = fs.readFileSync('app.css', 'utf-8')
    view.webContents.addListener('dom-ready', () => {
        view.webContents.insertCSS(css)
    })
})

app.on('window-all-closed', () => {
    app.quit()
})
