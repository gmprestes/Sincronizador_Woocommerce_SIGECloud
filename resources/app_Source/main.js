var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1024, height: 700});

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  //mainWindow.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
    app.quit();
  });
});
