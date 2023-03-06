const { app, BrowserWindow, Tray, Menu, dialog } = require('electron');
const path = require('path');
const inserirDadosCSV = require('./functions/inserirDadosCSV');
const getPrinterInformation = require('./controllers/getPrinterInformation');

//express server
const server = require('./app');

//Electron build

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    icon: './public/images/icon.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });



  mainWindow.removeMenu();
  //mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.loadURL('http://localhost:3002/');
  mainWindow.maximize();

  let tray = new Tray('./public/images/icon48x48.png');
  let windowIsVisible;

  const template = [
    {
      type: 'separator',
    },
    {
      label: 'Importar', click: function (req, res) {
        dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{ name: 'CSV', extensions: ['csv'] }]
        }).then(result => {
          if (result.canceled) {
            console.log("Cancelado" + result.canceled);
          } else {
            inserirDadosCSV(result.filePaths);
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
              defaultId: 1,
              type: "info",
              title: "Importação de CSV",
              message: "Importado com sucesso",
              buttons: ["OK"]
            });
          }
        }).catch(error => {
          console.log("Erro ao buscar CSV: " + error)
          dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            defaultId: 2,
            type: "error",
            title: "Importação de CSV",
            message: "Erro ao importar: " + error,
            buttons: ["OK"]
          });
        })
      },
    },
    {
      label: 'Atualizar', click: function (req, res) {

        getPrinterInformation();

        let progress = 0;

        const progressInterval = setInterval(() => {
          progress += 0.025;
          mainWindow.setProgressBar(progress);

          if (progress >= 1) {
            mainWindow.setProgressBar(-1);
            clearInterval(progressInterval);
            mainWindow.reload();
          }
        }, 120)
      },
    },
    {
      label: 'Sair', click: function () {
        mainWindow.destroy();
        app.quit();
      },
    },
  ];
  const contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Monitoramento de impressoras');

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('show', () => {
    windowIsVisible = true;
  });

  mainWindow.on('hide', function () {
    windowIsVisible = false;
  });

  mainWindow.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  tray.on('click', () => {
    if (windowIsVisible) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.commandLine.appendSwitch('ignore-certificate-errors');
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
