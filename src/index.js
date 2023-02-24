const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const database = require("./database/db")
const Printers = require("./database/models/printerModel")
const PrinterStatus = require("./database/models/printerStatusModel")

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
      nodeIntegration: true
    },
  });



  //mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.removeMenu();
  mainWindow.loadURL('http://localhost:3002/');

  let tray = new Tray('./public/images/icon48x48.png');
  let windowIsVisible;

  const template = [
    {
      type: 'separator',
    },
    {
      label: 'Mostrar', click: function () {
        mainWindow.show();
      },
    },
    {
      label: 'Atualizar', click: function () {
        let dados = [];

        function refreshPrinterData() {

          PrinterStatus.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] }, order: ["nomeFila"]
          })
            .then(data => {

              data.forEach(printerData => {
                dados.push({
                  nomeFila: printerData.nomeFila,
                  enderecoFila: printerData.enderecoFila,
                  rede: printerData.rede,
                  modelo: printerData.modelo,
                  serial: printerData.serial,
                  fabricante: printerData.fabricante,
                  toner: printerData.toner,
                  unidadeImagem: printerData.unidadeImagem,
                  kitManutencao: printerData.kitManutencao,
                  contador: printerData.contador
                })
              })
            })
        }
        refreshPrinterData();
        mainWindow.reload();
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
